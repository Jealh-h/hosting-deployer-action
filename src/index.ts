import * as core from '@actions/core';
import deploy from './deploy';
import getPayload from './getPayload';

export const run = async (): Promise<void> => {
  const serviceId = core.getInput('service-id');
  const token = core.getInput('token');
  const file = core.getInput('file');
  const directory = core.getInput('directory');
  const changelog = core.getInput('changelog');

  try {
    core.startGroup('Verifying file or directory');
    const { body, size } = await getPayload(file, directory);
    core.info(`✔ Deploy package size is ${size}.`);
    core.endGroup();

    core.startGroup('Deploy to byteinspire...');
    const { version, hostingUrl } = await deploy({
      serviceId,
      token,
      payload: body,
      changelog,
    });
    core.info(
      `✔ Successfully deployed hosting to ByteInspire. Updated version to ${version}`,
    );
    core.setOutput('version', version);
    core.setOutput('hosting-url', hostingUrl);
    core.endGroup();
  } catch (e) {
    core.setFailed(e.message);
  }
};

// this module was run directly from the command line as in node xxx.js
if (require.main === module) {
  run();
}
