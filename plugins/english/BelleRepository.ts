import { Plugin } from '@libs/plugin';
import { load, CheerioAPI } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';
import dayjs from 'dayjs';

const includesAny = (str: string, keywords: string[]) =>
  new RegExp(keywords.join('|')).test(str);

class BelleRepositoryPlugin implements Plugin.PluginBase {
  id = 'bellerepository';
  name = 'Belle Repository';
  icon = 'src/en/bellerepository/mainducky.png';
  site = 'https://bellerepository.com/';
  version = '1.0.2';
  filters = [];

  private async getCheerio(
    url: string,
    search: boolean = false,
  ): Promise<CheerioAPI> {
    const r = await fetchApi(url);
    if (!r.ok && !search) {
      throw new Error(
        'Could not reach site (' + r.status + ') try to open in webview.',
      );
    }
    const $ = load(await r.text());
    const title = $('title').text().trim();
    if (
      title == 'Bot Verification' ||
      title == 'You are being redirected...' ||
      title == 'Un instant...' ||
      title == 'Just a moment...' ||
      title == 'Redirecting...'
    )
      throw new Error('Captcha error, please open in webview');
    return $;
  }

  private parseNovelsFromPage(loadedCheerio: CheerioAPI): Plugin.NovelItem[] {
    const novels: Plugin.NovelItem[] = [];

    loadedCheerio('.manga-title-badges').remove();

    loadedCheerio(
      '.page-item-detail, .c-tabs-item__content, .manga-slider .slider__item',
    ).each((index, element) => {
      const novelName = loadedCheerio(element)
        .find('.post-title, .manga-title, h3')
        .first()
        .text()
        .trim();
      const novelUrl =
        loadedCheerio(element)
          .find('.post-title a, .manga-title a, a')
          .first()
          .attr('href') || '';
      if (!novelName || !novelUrl) return;
      const image = loadedCheerio(element).find('img').first();
      const novelCover =
        image.attr('data-src') ||
        image.attr('src') ||
        image.attr('data-lazy-srcset') ||
        defaultCover;
      const novel: Plugin.NovelItem = {
        name: novelName,
        cover: novelCover,
        path: novelUrl.replace(/https?:\/\/.*?\//, '/'),
      };
      novels.push(novel);
    });

    return novels;
  }

  async popularNovels(
    pageNo: number,
    options: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    try {
      let url = this.site + '/page/' + pageNo + '/?s=&post_type=wp-manga';
      if (options?.showLatestNovels) {
        url += '&m_orderby=latest';
      }

      const loadedCheerio = await this.getCheerio(url, pageNo != 1);
      return this.parseNovelsFromPage(loadedCheerio);
    } catch (error) {
      console.error('BelleRepository: Error in popularNovels:', error);
      return [];
    }
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    try {
      let loadedCheerio = await this.getCheerio(this.site + novelPath, false);

      loadedCheerio('.manga-title-badges, #manga-title span').remove();
      const novel: Plugin.SourceNovel = {
        path: novelPath,
        name:
          loadedCheerio('.post-title h1').text().trim() ||
          loadedCheerio('#manga-title h1').text().trim() ||
          loadedCheerio('.manga-title').text().trim() ||
          '',
      };

      novel.cover =
        loadedCheerio('.summary_image > a > img').attr('data-lazy-src') ||
        loadedCheerio('.summary_image > a > img').attr('data-src') ||
        loadedCheerio('.summary_image > a > img').attr('src') ||
        defaultCover;

      loadedCheerio('.post-content_item, .post-content').each(function () {
        const detailName = loadedCheerio(this).find('h5').text().trim();
        const detail =
          loadedCheerio(this).find('.summary-content') ||
          loadedCheerio(this).find('.summary_content');

        switch (detailName) {
          case 'Genre(s)':
          case 'Genre':
          case 'Tags(s)':
          case 'Tag(s)':
          case 'Tags':
          case 'Género(s)':
          case 'Kategori':
          case 'التصنيفات':
            if (novel.genres)
              novel.genres +=
                ', ' +
                detail
                  .find('a')
                  .map((i, el) => loadedCheerio(el).text())
                  .get()
                  .join(', ');
            else
              novel.genres = detail
                .find('a')
                .map((i, el) => loadedCheerio(el).text())
                .get()
                .join(', ');
            break;
          case 'Author(s)':
          case 'Author':
          case 'Autor(es)':
          case 'المؤلف':
          case 'المؤلف (ين)':
            novel.author = detail.text().trim();
            break;
          case 'Status':
          case 'Novel':
          case 'Estado':
          case 'Durum':
            novel.status =
              detail.text().trim().includes('OnGoing') ||
              detail.text().trim().includes('مستمرة')
                ? NovelStatus.Ongoing
                : NovelStatus.Completed;
            break;
          case 'Artist(s)':
            novel.artist = detail.text().trim();
            break;
        }
      });

      // Checks for "Madara NovelHub" version
      {
        if (!novel.genres)
          novel.genres = loadedCheerio('.genres-content').text().trim();
        if (!novel.status)
          novel.status = loadedCheerio('.manga-status')
            .text()
            .trim()
            .includes('OnGoing')
            ? NovelStatus.Ongoing
            : NovelStatus.Completed;
        if (!novel.author)
          novel.author = loadedCheerio('.manga-author a').text().trim();
        if (!novel.rating)
          novel.rating = parseFloat(
            loadedCheerio('.post-rating span').text().trim(),
          );
      }

      if (!novel.author)
        novel.author = loadedCheerio('.manga-authors').text().trim();

      loadedCheerio(
        'div.summary__content .code-block,script,noscript',
      ).remove();
      novel.summary =
        loadedCheerio('div.summary__content').text().trim() ||
        loadedCheerio('#tab-manga-about').text().trim() ||
        loadedCheerio('.post-content_item h5:contains("Summary")')
          .next()
          .find('span')
          .map((i, el) => loadedCheerio(el).text())
          .get()
          .join('\n\n')
          .trim() ||
        loadedCheerio('.manga-summary p')
          .map((i, el) => loadedCheerio(el).text())
          .get()
          .join('\n\n')
          .trim() ||
        loadedCheerio('.manga-excerpt p')
          .map((i, el) => loadedCheerio(el).text())
          .get()
          .join('\n\n')
          .trim();

      // Chapter extraction using Madara's AJAX method
      const chapters: Plugin.ChapterItem[] = [];
      let html = '';

      // Try the new chapter endpoint first
      try {
        html = await fetchApi(this.site + novelPath + 'ajax/chapters/', {
          method: 'POST',
          referrer: this.site + novelPath,
        }).then(res => res.text());
      } catch {
        // Fall back to the classic AJAX method
        const novelId =
          loadedCheerio('.rating-post-id').attr('value') ||
          loadedCheerio('#manga-chapters-holder').attr('data-id') ||
          '';

        if (novelId) {
          const formData = new FormData();
          formData.append('action', 'manga_get_chapters');
          formData.append('manga', novelId);

          html = await fetchApi(this.site + 'wp-admin/admin-ajax.php', {
            method: 'POST',
            body: formData,
          }).then(res => res.text());
        }
      }

      if (html !== '0' && html) {
        loadedCheerio = load(html);
      }

      const totalChapters = loadedCheerio('.wp-manga-chapter').length;
      loadedCheerio('.wp-manga-chapter').each((chapterIndex, element) => {
        let chapterName = loadedCheerio(element).find('a').text().trim();
        const locked = element.attribs['class'].includes('premium-block');
        if (locked) {
          chapterName = '🔒 ' + chapterName;
        }

        let releaseDate = loadedCheerio(element)
          .find('span.chapter-release-date')
          .text()
          .trim();

        if (releaseDate) {
          releaseDate = this.parseData(releaseDate);
        } else {
          releaseDate = dayjs().format('LL');
        }

        const chapterUrl = loadedCheerio(element).find('a').attr('href') || '';

        if (chapterUrl && chapterUrl != '#') {
          chapters.push({
            name: chapterName,
            path: chapterUrl.replace(/https?:\/\/.*?\//, '/'),
            releaseTime: releaseDate || null,
            chapterNumber: totalChapters - chapterIndex,
          });
        }
      });

      novel.chapters = chapters.reverse();
      return novel;
    } catch (error) {
      console.error('BelleRepository: Error in parseNovel:', error);
      throw error;
    }
  }

  async parseChapter(chapterPath: string): Promise<string> {
    try {
      const loadedCheerio = await this.getCheerio(
        this.site + chapterPath,
        false,
      );
      const chapterText =
        loadedCheerio('.text-left') ||
        loadedCheerio('.text-right') ||
        loadedCheerio('.entry-content') ||
        loadedCheerio('.c-blog-post > div > div:nth-child(2)');

      return chapterText.html() || '';
    } catch (error) {
      console.error('BelleRepository: Error in parseChapter:', error);
      throw error;
    }
  }

  async searchNovels(
    searchTerm: string,
    pageNo?: number,
  ): Promise<Plugin.NovelItem[]> {
    const url =
      this.site +
      '/page/' +
      (pageNo || 1) +
      '/?s=' +
      encodeURIComponent(searchTerm) +
      '&post_type=wp-manga';
    const loadedCheerio = await this.getCheerio(url, true);
    return this.parseNovelsFromPage(loadedCheerio);
  }

  private parseData = (date: string) => {
    let dayJSDate = dayjs(); // today
    const timeAgo = date.match(/\d+/)?.[0] || '';
    const timeAgoInt = parseInt(timeAgo, 10);

    if (!timeAgo) return date; // there is no number!

    if (includesAny(date, ['detik', 'segundo', 'second', 'วินาที'])) {
      dayJSDate = dayJSDate.subtract(timeAgoInt, 'second'); // go back N seconds
    } else if (
      includesAny(date, [
        'menit',
        'dakika',
        'min',
        'minute',
        'minuto',
        'นาที',
        'دقائق',
      ])
    ) {
      dayJSDate = dayJSDate.subtract(timeAgoInt, 'minute'); // go back N minute
    } else if (
      includesAny(date, [
        'jam',
        'saat',
        'heure',
        'hora',
        'hour',
        'ชั่วโมง',
        'giờ',
        'ore',
        'ساعة',
        '小时',
      ])
    ) {
      dayJSDate = dayJSDate.subtract(timeAgoInt, 'hours'); // go back N hours
    } else if (
      includesAny(date, [
        'hari',
        'gün',
        'jour',
        'día',
        'dia',
        'day',
        'วัน',
        'ngày',
        'giorni',
        'أيام',
        '天',
      ])
    ) {
      dayJSDate = dayJSDate.subtract(timeAgoInt, 'days'); // go back N days
    } else if (includesAny(date, ['week', 'semana'])) {
      dayJSDate = dayJSDate.subtract(timeAgoInt, 'week'); // go back N a week
    } else if (includesAny(date, ['month', 'mes'])) {
      dayJSDate = dayJSDate.subtract(timeAgoInt, 'month'); // go back N months
    } else if (includesAny(date, ['year', 'año'])) {
      dayJSDate = dayJSDate.subtract(timeAgoInt, 'year'); // go back N years
    } else {
      if (dayjs(date).format('LL') !== 'Invalid Date') {
        return dayjs(date).format('LL');
      }
      return date;
    }

    return dayJSDate.format('LL');
  };

  resolveUrl = (path: string, isNovel?: boolean) => {
    if (path.startsWith('http')) {
      return path;
    }
    return this.site + path.replace(/^\//, '');
  };
}

export default new BelleRepositoryPlugin();
