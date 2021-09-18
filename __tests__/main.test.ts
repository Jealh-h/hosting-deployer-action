import { run } from './../src/index';
import nock from 'nock';
import * as core from '@actions/core';
import fs from 'fs';

const mockVersion = 1;
const mockPreviewUrl = 'https://hosting.test.com';

jest.mock('@actions/core');

describe('deploy hosting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    nock.cleanAll();
  });

  afterAll(() => {
    // delete test zip file
    try {
      fs.unlinkSync(`${process.cwd()}/file.zip`);
      // eslint-disable-next-line no-empty
    } catch {}
  });

  it('successful deployment using zip file', async () => {
    nock('https://open.qingfuwu.cn')
      .post(/\/v1\/services\/.+\/hosting\/versions/)
      .reply(200, {
        version: mockVersion,
        default_hosting_url: mockPreviewUrl,
      });

    const inputs = {
      'service-id': 'tttest',
      token: 'test token',
      file: 'demo.zip',
      changelog: 'test',
    };
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name];
    });

    await run();
    expect(core.setFailed).toHaveBeenCalledTimes(0);
    expect(core.setOutput).toHaveBeenCalledTimes(2);
    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'version', 1);
    expect(core.setOutput).toHaveBeenNthCalledWith(
      2,
      'hosting-url',
      mockPreviewUrl,
    );
  });

  it('successful deployment using directory', async () => {
    nock('https://open.qingfuwu.cn')
      .post(/\/v1\/services\/.+\/hosting\/versions/)
      .reply(200, {
        version: mockVersion,
        default_hosting_url: mockPreviewUrl,
      });

    const inputs = {
      'service-id': 'tttest',
      token: 'test token',
      directory: './demo',
      changelog: 'test',
    };
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name];
    });

    await run();
    expect(core.setFailed).toHaveBeenCalledTimes(0);
    expect(core.setOutput).toHaveBeenCalledTimes(2);
    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'version', 1);
    expect(core.setOutput).toHaveBeenNthCalledWith(
      2,
      'hosting-url',
      mockPreviewUrl,
    );
  });

  it('Empty file and directory parameters should display related error message', async () => {
    const inputs = {
      'service-id': 'tttest',
      token: 'test token',
      changelog: 'test',
    };

    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name];
    });

    await run();
    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      '[file] and [directory] param is empty.',
    );
  });

  it('Token validation error should display related error message', async () => {
    nock('https://open.qingfuwu.cn')
      .post(/\/v1\/services\/.+\/hosting\/versions/)
      .reply(401, {
        error: {
          err_code: 10002,
        },
      });

    const inputs = {
      'service-id': 'tttest',
      token: 'test token',
      file: './demo.zip',
      changelog: 'test',
    };

    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name];
    });

    await run();
    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      'The token is invalid. Please make sure your token has the correct scope.',
    );
  });
});
