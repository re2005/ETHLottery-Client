import { ETHLoterryClientPage } from './app.po';

describe('ethloterry-client App', () => {
  let page: ETHLoterryClientPage;

  beforeEach(() => {
    page = new ETHLoterryClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
