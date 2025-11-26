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
  version = '1.0.6';
  filters: Filters | undefined = undefined;

  resolveUrl = (path: string, isNovel?: boolean) =>
    this.site + (isNovel ? '/series/' : '/series/') + path;

  // ------------------------------
  // Popular novels
  // ------------------------------
  async popularNovels(pageNo: number): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    // Example placeholder: you can expand this later with real AJAX fetching
    novels.push({
      name: 'The Seed Thief',
      path: '44854',
      cover: defaultCover,
    });

    return novels;
  }

  // ------------------------------
  // Search novels
  // ------------------------------
  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    // Example placeholder: real AJAX search can go here
    // novels.push({ name: 'Novel Name', path: '12345', cover: defaultCover });

    return novels;
  }

  // ------------------------------
  // Parse novel info + chapters
  // ------------------------------
  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: '',
      cover: defaultCover,
      chapters: [],
    };

    // Fetch the page to get the novel title
    const html = await fetchApi(this.resolveUrl(novelPath, true));
    const $ = loadCheerio(html);
    novel.name = $('h1').first().text().trim() || 'Untitled';

    // Fetch AJAX JSON for chapters
    const ajaxUrl = `${this.site}/api/series/${novelPath}/chapters`;
    const response = await fetchApi(ajaxUrl);
    const data = response.data || [];

    const chapters: Plugin.ChapterItem[] = [];

    for (const item of data) {
      // Extract chapter number from title, e.g., "Vol. 1 Chapter 1.1 - Title"
      let chapterNumber = 0;
      const match = item.title.match(/Chapter\s([\d.]+)/);
      if (match) chapterNumber = parseFloat(match[1]);

      chapters.push({
        name: item.title,
        path: item.url.replace(this.site + '/series/', ''), // relative path
        releaseTime: '', // optional: could parse from AJAX if available
        chapterNumber,
      });
    }

    // Sort chapters ascending by chapterNumber
    chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);

    novel.chapters = chapters;
    novel.cover = defaultCover;
    novel.status = NovelStatus.Ongoing; // default, update if you want

    return novel;
  }

  // ------------------------------
  // Parse chapter text
  // ------------------------------
  async parseChapter(chapterPath: string): Promise<string> {
    const html = await fetchApi(this.resolveUrl(chapterPath));
    const $ = loadCheerio(html);
    const chapterText = $('#chapter-content').html() || '';
    return chapterText;
  }
}

export default new ReadHivePlugin();
module.exports = new ReadHivePlugin();
