// Copyright (C) Microsoft Corp. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { installErrorStackModuleAnnotations } from './node_modules/@microsoft/edge-devtools-crash-analyzer-support/dist/index.mjs';
import { demonstrateError} from './demonstrate-error.mjs';

installErrorStackModuleAnnotations(Error);

document.querySelector('#show').onclick = () => {
  demonstrateError();
}

async function failAsynchronously() {
  await new Promise(resolve => requestAnimationFrame(resolve));
  demonstrateError();
}

document.querySelector('#show-async').onclick = () => {
  failAsynchronously();
}

window.onerror = (_m, _s, _l, _c, error) => {
  document.querySelector('#output').textContent = error.stack;
};

window.onunhandledrejection = event => {
  document.querySelector('#output').textContent = event.reason.stack;
};
