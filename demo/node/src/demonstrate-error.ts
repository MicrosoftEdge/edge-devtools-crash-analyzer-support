// Copyright (C) Microsoft Corp. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { invokeCallback } from './invoke-callback.js';

export function demonstrateError() {
  invokeCallback(() => {
    throw new Error('This demonstrates an error with multiple modules involved.');
  });
}
