// Copyright (C) Microsoft Corp. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Defined by V8 builtins
export interface CallSite {
  getThis(): unknown;
  getTypeName(): string;
  getFunction(): Function;
  getFunctionName(): string;
  getMethodName(): string;
  getFileName(): string;
  getLineNumber(): number;
  getColumnNumber(): number;
  getEvalOrigin(): string|undefined;
  isTopLevel(): boolean;
  isEval(): boolean;
  isNative(): boolean;
  isConstructor(): boolean;
  isAsync(): boolean;
  isPromiseAll(): boolean;
  isPromiseAny(): boolean;
  getPromiseIndex(): number|undefined;

  getScriptHash?: () => string;
}

export interface ErrorConstructor {
  prepareStackTrace: StackTracePreparer|undefined;
}

export type StackTracePreparer = (error: Error, frames: CallSite[]) => string|undefined;
