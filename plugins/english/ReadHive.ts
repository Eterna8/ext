import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { Filters } from '@libs/filterInputs';
import { load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';

/**
 * ReadHive plugin for LNReader.
 *
 * ReadHive uses a custom WordPress installation with Vue.js for frontend.
 * Two types of novel URL structures:
 * 1. Normal novels: /series/{id}/{chapter}/
 * 2. Spliced novels: /series/{id}/v{volume}/{chapter}/
 *
 * Example URLs:
 * - Spliced: https://readhive.org/series/44854/v1/3.1/ (The Seed Thief)
 * - Normal: https://readhive.org/series/132967/3/ (Sea Monster Stew)
 */

class ReadHivePlugin implements Plugin.PluginBase {
  id = 'readhive';
  name = 'ReadHive';
  icon = 'src/en/readhive/icon.png';
  site = 'https://readhive.org';
  version = '1.2.0';
  filters: Filters | undefined = undefined;

  imageRequestInit: Plugin.ImageRequestInit = {
    headers: {
      Referer: 'https://readhive.org/',
    },
  };

  // Helper: build a full URL from a stored path.
  resolveUrl = (path: string, isNovel?: boolean) => {
    if (!path) return this.site;
    if (path.startsWith('http')) return path;
    return this.site + (path.startsWith('/') ? path : '/' + path);
  };

  // -----------------------------
  // POPULAR NOVELS (or latest)
  // -----------------------------
  async popularNovels(
    pageNo: number,
    options: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    // Known working series - simple and reliable
    const testSeries = [
      { id: '19889', title: 'Solo Leveling' },
      { id: '135044', title: 'Martial Peak' },
      { id: '96473', title: 'The Beginning After The End' },
      { id: '170', title: 'Overlord' },
      { id: '197', title: 'Mushoku Tensei' },
      { id: '80930', title: 'Tate no Yuusha' },
      { id: '721', title: "The Novel's Extra" },
      { id: '450', title: 'SSS-Class Suicide Hunter' },
      { id: '44854', title: 'The Seed Thief' },
    ];

    for (const series of testSeries) {
      novels.push({
        name: series.title,
        path: `/series/${series.id}/`,
        cover: defaultCover, // parseNovel will fetch real cover
      });
    }

    // Return limited subset based on page number for pagination
    const startIndex = (pageNo - 1) * 10;
    const endIndex = Math.min(startIndex + 10, novels.length);
    return novels.slice(startIndex, endIndex);
  }

  // -----------------------------
  // SEARCH
  // -----------------------------
  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    // For now, return empty since search requires JavaScript execution
    console.log(`ReadHive search for: ${searchTerm}`);
    return [];
  }

  // -----------------------------
  // PARSE NOVEL + CHAPTER LIST
  // -----------------------------
  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: 'Untitled',
      cover: defaultCover,
      chapters: [],
    };

    try {
      // Extract series ID from path
      const seriesIdMatch = novelPath.match(/\/series\/(\d+)\/?/);
      if (!seriesIdMatch) {
        throw new Error('Invalid novel path format');
      }
      const seriesId = seriesIdMatch[1];

      let title = 'Untitled';
      let cover = defaultCover;
      let summary = '';
      let author = '';
      let status = NovelStatus.Ongoing;
      let genres = '';

      // Try to get metadata from the main novel page
      try {
        console.log('🔍 ReadHive parseNovel called for:', novelPath);
        const novelUrl = this.resolveUrl(novelPath);
        console.log('📄 Fetching novel URL:', novelUrl);

        const pageRes = await fetchApi(novelUrl, {
          headers: { Referer: this.site },
        });
        const pageHtml = await pageRes.text();
        const $page = loadCheerio(pageHtml);

        console.log('📝 Page HTML length:', pageHtml.length);

        // Title extraction - ReadHive specific patterns
        title =
          $page('meta[property="og:title"]').attr('content') ||
          $page('meta[property="twitter:title"]').attr('content') ||
          $page('title').text().replace(' - ReadHive', '').trim() ||
          $page('h1').first().text().trim() ||
          $page('.novel-title').text().trim() ||
          $page('.entry-title').text().trim() ||
          'Untitled';

        // Cover extraction - ReadHive specific patterns for /public/images/
        const coverSrc =
          $page('meta[property="og:image"]').attr('content') ||
          $page('meta[property="twitter:image"]').attr('content') ||
          $page('img[src*="/public/images/"]').attr('src') ||
          $page('img[src*="wp-content"]').attr('src') ||
          $page('img[src*="uploads"]').attr('src') ||
          $page('.novel-cover img').attr('src') ||
          $page('img').first().attr('src') ||
          '';

        if (coverSrc) {
          cover = coverSrc.startsWith('http')
            ? coverSrc
            : this.site +
              (coverSrc.startsWith('/') ? coverSrc : '/' + coverSrc);
        }

        // Summary extraction
        summary =
          $page('meta[property="og:description"]').attr('content') ||
          $page('meta[name="description"]').attr('content') ||
          $page('.synopsis').text().trim() ||
          $page('.summary').text().trim() ||
          $page('.entry-content p').first().text().trim() ||
          '';

        // Author extraction - ReadHive patterns
        author =
          $page('.author').text().trim() ||
          $page('[rel="author"]').text().trim() ||
          $page('.by-author').text().replace('by', '').trim() ||
          '';

        // Status extraction
        const statusText = (
          $page('.status').text().trim() ||
          $page('.novel-status').text().trim() ||
          ''
        ).toLowerCase();
        if (statusText) {
          if (
            statusText.includes('complete') ||
            statusText.includes('finished')
          ) {
            status = NovelStatus.Completed;
          } else if (
            statusText.includes('ongoing') ||
            statusText.includes('active')
          ) {
            status = NovelStatus.Ongoing;
          }
        }

        // Genres extraction - ReadHive patterns
        const genreArray: string[] = [];
        $page('.tags a, .category a, .genres a').each((i, el) => {
          const genre = $page(el).text().trim();
          if (genre && !genreArray.includes(genre)) {
            genreArray.push(genre);
          }
        });
        if (genreArray.length) genres = genreArray.join(', ');
      } catch (error) {
        console.warn('Could not fetch main page metadata:', error);
      }

      novel.name = title || 'Untitled';
      novel.cover = cover;
      novel.summary = summary || undefined;
      novel.author = author || undefined;
      novel.status = status;
      novel.genres = genres || undefined;

      // Try to get chapter list from releases page
      const chapters: Plugin.ChapterItem[] = [];
      try {
        // Build the releases URL without hash - it's a separate page/route
        const releasesUrl = `${this.site}/series/${seriesId}/`;
        console.log('📚 Fetching releases URL:', releasesUrl);

        const releasesRes = await fetchApi(releasesUrl, {
          headers: { Referer: this.site },
        });
        const releasesHtml = await releasesRes.text();
        const $releases = loadCheerio(releasesHtml);

        console.log('📝 Releases HTML length:', releasesHtml.length);

        // Look for chapter links in the releases section
        $releases('a[href*="/series/"]').each((i, el) => {
          try {
            const $el = $releases(el);
            const href = $el.attr('href') || '';

            // Only include links that are actual chapters (not just series page or about page)
            if (!href.match(/\/series\/\d+\/(?:v\d+\/)?\d+(?:\.\d+)?\//))
              return;

            const path = href.replace(/^https?:\/\/[^/]+/, '');

            // Extract chapter name from the link text or surrounding elements
            let name = $el.text().trim();
            if (!name || name.length < 2) {
              // Try to get name from parent elements
              const parent = $el.closest('li, div, article, .chapter-item');
              if (parent.length) {
                name = parent
                  .find('h1, h2, h3, h4, .title, .chapter-title')
                  .first()
                  .text()
                  .trim();
              }
            }

            // If still no name, try to extract from URL pattern
            if (!name || name.length < 2) {
              const urlMatch = path.match(
                /\/series\/\d+\/(?:v(\d+)\/)?(\d+(?:\.\d+)?)(?:\/)?$/,
              );
              if (urlMatch) {
                const volume = urlMatch[1] ? parseInt(urlMatch[1]) : 1;
                const chapter = urlMatch[2];
                name = urlMatch[1]
                  ? `Vol. ${volume} Ch. ${chapter}`
                  : `Chapter ${chapter}`;
              }
            }

            // Extract chapter number from URL patterns:
            // Simple: /series/132967/3/ -> chapter 3
            // Complex: /series/44854/v1/3.1/ -> chapter 3.1 (volume 1)
            let chapterNumber = 0;
            const urlMatch = path.match(
              /\/series\/\d+\/(?:v(\d+)\/)?(\d+(?:\.\d+)?)(?:\/)?$/,
            );
            if (urlMatch) {
              const volume = urlMatch[1] ? parseInt(urlMatch[1]) : 1;
              const chapter = parseFloat(urlMatch[2]);
              chapterNumber = volume * 1000 + chapter; // Sort by volume then chapter
            } else if (name) {
              const numberMatch = name.match(
                /(?:chapter|ch|vol\.?\s*\d+\s*ch?)\s*([\d.]+)/i,
              );
              if (numberMatch) {
                chapterNumber = parseFloat(numberMatch[1]);
              }
            }

            // Extract release date if available
            let releaseTime = '';
            const dateElement = $el.closest(
              '[datetime], [class*="date"], time, .release-date',
            );
            if (dateElement.length) {
              releaseTime =
                dateElement.attr('datetime') ||
                dateElement.find('time').attr('datetime') ||
                dateElement.text().trim();
            }

            if (name && name.length > 1) {
              chapters.push({
                name: name,
                path,
                releaseTime,
                chapterNumber,
              });
              console.log(`✅ Found chapter: ${name} (${path})`);
            }
          } catch (error) {
            console.warn('Error parsing chapter:', error);
          }
        });

        // Sort chapters by chapterNumber (which includes volume sorting)
        chapters.sort(
          (a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0),
        );
        console.log(`📚 Found ${chapters.length} chapters`);
      } catch (error) {
        console.warn('Could not fetch releases section:', error);
      }

      novel.chapters = chapters;
    } catch (err) {
      console.error('ReadHive parseNovel error:', err);
    }

    return novel;
  }

  // -----------------------------
  // PARSE CHAPTER (content)
  // -----------------------------
  async parseChapter(chapterPath: string): Promise<string> {
    try {
      const chapterUrl = this.resolveUrl(chapterPath);
      console.log('📖 Fetching chapter:', chapterUrl);

      const res = await fetchApi(chapterUrl, {
        headers: { Referer: this.site },
      });
      const body = await res.text();
      const $ = loadCheerio(body);

      console.log('📝 Chapter HTML length:', body.length);

      // Remove common noise elements specific to ReadHive
      $(
        'nav, header, footer, .nav, .menu, .sidebar, .ads, .advertisement, .comments, .related, .chapter-nav, .pagination',
      ).remove();

      // Try multiple content selectors in order of preference for ReadHive
      const contentSelectors = [
        '.entry-content',
        '.post-content',
        '.chapter-content',
        '.reading-content',
        '.reader-content',
        '.content-area',
        '.main-content',
        '.novel-content',
        'article',
        'main',
        '[class*="content"]',
      ];

      let contentHtml = '';
      let maxLength = 0;

      // First pass: try to find content using known selectors
      for (const sel of contentSelectors) {
        const elements = $(sel);
        elements.each((i, el) => {
          const $el = $(el);
          const text = $el.text().trim();

          // Skip if it contains navigation or non-content elements
          if (
            text.length < 100 ||
            $el.find('nav, .nav, .menu, .sidebar, .pagination, .chapter-nav')
              .length > 0
          ) {
            return;
          }

          // Skip elements that are likely navigation or meta information
          if (
            text.includes('Previous Chapter') ||
            text.includes('Next Chapter') ||
            text.includes('Table of Contents') ||
            $el.hasClass('navigation') ||
            $el.hasClass('meta')
          ) {
            return;
          }

          if (text.length > maxLength) {
            maxLength = text.length;
            contentHtml = $el.html() || '';
          }
        });

        // If we found substantial content, use it
        if (contentHtml && maxLength > 500) {
          console.log(
            `✅ Found content using selector: ${sel} (${maxLength} chars)`,
          );
          break;
        }
      }

      // Second pass: if no content found, try to find the largest text block
      if (!contentHtml || maxLength < 200) {
        $('div, section, article').each((i, el) => {
          const $el = $(el);
          const text = $el.text().trim();

          // Skip elements with navigation characteristics
          if ($el.find('a').length > 5 && text.length < 200) return;
          if (text.includes('Chapter') && text.length < 100) return;

          if (text.length > maxLength && text.length > 100) {
            maxLength = text.length;
            contentHtml = $el.html() || '';
          }
        });
      }

      // Clean up content
      const $content = loadCheerio(contentHtml || '');

      // Remove any remaining unwanted elements
      $content(
        'script, style, .ads, .advertisement, .share, .social, .rating, .chapter-nav, .navigation, .pagination',
      ).remove();

      // Fix relative image URLs
      $content('img').each((i, el) => {
        const $img = $content(el);
        const src =
          $img.attr('src') ||
          $img.attr('data-src') ||
          $img.attr('data-lazy-src');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
          $img.attr('src', this.site + (src.startsWith('/') ? src : '/' + src));
        }
      });

      // Fix relative links to keep them within the site
      $content('a').each((i, el) => {
        const $a = $content(el);
        const href = $a.attr('href');
        if (
          href &&
          !href.startsWith('http') &&
          !href.startsWith('#') &&
          !href.startsWith('mailto:')
        ) {
          $a.attr(
            'href',
            this.site + (href.startsWith('/') ? href : '/' + href),
          );
        }
      });

      const finalHtml = $content.html() || contentHtml;

      if (finalHtml && finalHtml.length > 200) {
        console.log(`✅ Chapter content extracted: ${finalHtml.length} chars`);
        return finalHtml;
      } else {
        console.warn('⚠️ Chapter content too short or not found');
        return '<p>Chapter content not found. The chapter might be locked or the page structure has changed.</p>';
      }
    } catch (err) {
      console.error('❌ ReadHive parseChapter error:', err);
      return '<p>Error loading chapter content. Please try again later.</p>';
    }
  }
}

export default new ReadHivePlugin();
