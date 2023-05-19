import {installErrorStackModuleAnnotations} from '@microsoft/edge-devtools-crash-analyzer-support';
import {demonstrateError} from './demonstrate-error.js';

// @ts-expect-error NodeJS and Window Error constructor differ
installErrorStackModuleAnnotations(Error);

process.on('uncaughtException', (e) => {
  console.log(e.stack);
});
process.on('unhandledRejection', (reason, p) => {
  console.log(reason);
});

async function main() {
  demonstrateError();
}

main();