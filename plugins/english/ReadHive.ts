import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { Filters } from '@libs/filterInputs';
import { load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';

class ReadHivePlugin implements Plugin.PluginBase {
  id = 'readhive';
  name = 'ReadHive';
  icon = 'src/en/readhive/readhive.jpg';
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
    const novels: Plugin.NovelItem[] = [];
    if (pageNo > 1) return novels;

    const url = this.site;
    const result = await fetchApi(url);
    const body = await result.text();
    const $ = loadCheerio(body);

    if (options.showLatestNovels) {
      $('h2:contains("Latest Updates")')
        .next('div.flex.flex-wrap')
        .children('div.flex.flex-col.w-full.px-2.mb-4')
        .each((i, el) => {
          const name = $(el).find('a.text-lg.font-medium').text().trim();
          const path = $(el).find('a.peer').attr('href');
          let cover = $(el).find('img').attr('src');

          if (cover && !cover.startsWith('http')) {
            cover = this.resolveUrl(cover);
          }
          if (path) {
            novels.push({ name, path, cover: cover || defaultCover });
          }
        });
    } else {
      $('h2:contains("Popular This Month")')
        .nextAll('div')
        .find('.swiper-slide.w-32.flex-shrink-0.group')
        .each((i, el) => {
          const name = $(el).find('h6.mt-2.text-sm.font-medium').text().trim();
          const path = $(el).find('a').attr('href');
          let cover = $(el).find('img').attr('src');

          if (cover && !cover.startsWith('http')) {
            cover = this.resolveUrl(cover);
          }
          if (path) {
            if (!novels.some(novel => novel.path === path)) {
              novels.push({ name, path, cover: cover || defaultCover });
            }
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

    const novels: Plugin.NovelItem[] = [];
    $('div.col-6.col-md-3.mb-4').each((i, el) => {
      const name = $(el).find('h5').text().trim();
      const path = $(el).find('a').attr('href');
      let cover = $(el).find('img').attr('src');

      if (cover && !cover.startsWith('http')) {
        cover = this.resolveUrl(cover);
      }
      if (path) {
        novels.push({ name, path, cover: cover || defaultCover });
      }
    });
    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: 'UNKNOWN',
      chapters: [],
    };
    const url = this.resolveUrl(novelPath);
    const result = await fetchApi(url);
    const body = await result.text();
    const $ = loadCheerio(body);

    novel.name = $(
      'h1.flex-grow.flex-shrink.mb-1.text-2xl.font-bold.lg:text-3xl.line-clamp-4',
    )
      .text()
      .trim();
    novel.cover = this.resolveUrl(
      $(
        'div.aspect-w-3.aspect-h-4.lg:aspect-w-4.lg:aspect-h-6.rounded.overflow-hidden img',
      ).attr('src') || defaultCover,
    );
    novel.author = $('span.leading-7.md:text-xl').text().trim();

    const summaryParagraphs: string[] = [];
    $('h2:contains("Synopsis")')
      .next('div.mb-4')
      .find('p')
      .each((i, el) => {
        summaryParagraphs.push($(el).text().trim());
      });
    novel.summary = summaryParagraphs.join('\n');

    const genres: string[] = [];
    $(
      'div.flex.flex-wrap a.px-3.py-1.mb-1.mr-2.text-sm.text-foreground.bg-shade.rounded.shadow-md.hover:bg-red.hover:text-white',
    ).each(function () {
      genres.push($(this).text());
    });
    novel.genres = genres.join(', ');

    const chapters: Plugin.ChapterItem[] = [];
    $('h3:contains("Table of Contents")')
      .next(
        'div.p-2.overflow-hidden.border.border-accent-border.rounded.shadow',
      )
      .find('a.flex.items-center.p-2.rounded.bg-accent.hover:bg-accent-hover')
      .each((i, el) => {
        const chapterName = $(el).find('span.ml-1').text().trim();
        const chapterPath = $(el).attr('href');
        const releaseTime = $(el).find('span.text-xs').text().trim();

        if (chapterPath) {
          chapters.push({
            name: chapterName,
            path: chapterPath.replace(this.site, ''),
            releaseTime: releaseTime,
          });
        }
      });

    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const url = this.resolveUrl(chapterPath);
    const result = await fetchApi(url);
    const body = await result.text();
    const $ = loadCheerio(body);

    const content = $('div.relative.lg:grid-in-content.mt-4');
    content.find('div.socials').remove();
    content.find('div.reader-settings').remove();
    content.find('div.nav-wrapper').remove();
    content.find('div.code-block').remove(); // Remove code blocks
    content.find('p:contains("• • •")').remove(); // Remove specific separator

    return content.html() || '';
  }
}
export default new ReadHivePlugin();
