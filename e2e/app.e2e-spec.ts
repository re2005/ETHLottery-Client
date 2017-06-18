import { ethlotteryClientPage } from './app.po';

describe('ethlottery-client App', () => {
  let page: ethlotteryClientPage;

  beforeEach(() => {
    page = new ethlotteryClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
