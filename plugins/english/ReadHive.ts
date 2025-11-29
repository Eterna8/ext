import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { Filters } from '@libs/filterInputs';
import { load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';

class ReadHivePlugin implements Plugin.PluginBase {
  id = 'readhive';
  name = 'ReadHive';
  icon = 'src/en/readhive/icon.jpg';
  site = 'https://readhive.org';
  version = '2.0.0';
  filters: Filters | undefined = undefined;

  resolveUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    return this.site + (path.startsWith('/') ? path : '/' + path);
  };

  async popularNovels(
    pageNo: number,
    options: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    if (pageNo > 1) return [];

    const url = this.site;
    const result = await fetchApi(url);
    const body = await result.text();
    const $ = loadCheerio(body);

    const novels: Plugin.NovelItem[] = [];
    const processedPaths = new Set<string>();

    if (options.showLatestNovels) {
      // Latest Updates section
      $('h2:contains("Latest Updates")')
        .next('.flex-wrap')
        .find('.px-2.mb-4')
        .each((i, el) => {
          const path = $(el).find('a.peer').attr('href');
          if (path && !processedPaths.has(path)) {
            const name = $(el).find('a.text-lg').text().trim();
            let cover = $(el).find('img').attr('src');
            if (cover && !cover.startsWith('http')) {
              cover = this.resolveUrl(cover);
            }
            novels.push({ name, path, cover: cover || defaultCover });
            processedPaths.add(path);
          }
        });
    } else {
      // Popular sections
      $('h2:contains("Popular")')
        .nextAll('.swiper')
        .find('.swiper-slide')
        .each((i, el) => {
          const path = $(el).find('a').attr('href');
          if (path && !processedPaths.has(path)) {
            const name = $(el).find('h6').text().trim();
            let cover = $(el).find('img').attr('src');
            if (cover && !cover.startsWith('http')) {
              cover = this.resolveUrl(cover);
            }
            novels.push({ name, path, cover: cover || defaultCover });
            processedPaths.add(path);
          }
        });
    }

    return novels;
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}/?s=${searchTerm}&page=${pageNo}`;
    const result = await fetchApi(url);
    const body = await result.text();
    const $ = loadCheerio(body);

    return $('div.col-6.col-md-3.mb-4')
      .map((i, el) => {
        const path = $(el).find('a').attr('href');
        if (!path) return null;

        const name = $(el).find('h5').text().trim();
        let cover = $(el).find('img').attr('src');
        if (cover && !cover.startsWith('http')) {
          cover = this.resolveUrl(cover);
        }
        return { name, path, cover: cover || defaultCover };
      })
      .get()
      .filter(Boolean) as Plugin.NovelItem[];
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.resolveUrl(novelPath);
    const result = await fetchApi(url);
    const body = await result.text();
    const $ = loadCheerio(body);

    const name = $('h1[class*="text-2xl"]').first().text().trim();
    const cover =
      $('img[alt*="Cover"]').attr('src') ||
      $('img[alt*="Thumbnail"]').attr('src') ||
      defaultCover;

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: name,
      cover: this.resolveUrl(cover),
      author: $('span.leading-7').text().trim(),
      summary: $('h2:contains("Synopsis")').next('div').find('p').text().trim(),
      genres: $('div.flex-wrap a[href*="/genre/"]')
        .map((i, el) => $(el).text())
        .get()
        .join(', '),
      chapters: [],
    };

    const chapterElements = $('div[x-show="tab === \'releases\'"]').find(
      'a[href*="/series/"]',
    );

    const chapters: Plugin.ChapterItem[] = chapterElements
      .map((i, el) => {
        const path = $(el).attr('href');
        if (!path) return null;

        const chapterName = $(el).find('span.ml-1').text().trim();
        const releaseTime = $(el).find('span.text-xs').text().trim();

        return {
          name: chapterName,
          path: path.replace(this.site, ''),
          releaseTime: releaseTime,
        };
      })
      .get()
      .filter(Boolean) as Plugin.ChapterItem[];

    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const url = this.resolveUrl(chapterPath);
    const result = await fetchApi(url);
    const body = await result.text();
    const $ = loadCheerio(body);

    const content = $(
      'div[class*="lg:grid-in-content"] div[style*="font-size"]',
    );

    content.find('div[data-fuse]').remove();
    content.find('div.socials').remove();
    content.find('div.reader-settings').remove();
    content.find('div.nav-wrapper').remove();
    content.find('p:contains("• • •")').remove();

    content.find('p').each((i, el) => {
      if ($(el).html()?.trim() === '&nbsp;' || $(el).html()?.trim() === '') {
        $(el).remove();
      }
    });

    return content.html() || '';
  }
}
export default new ReadHivePlugin();
