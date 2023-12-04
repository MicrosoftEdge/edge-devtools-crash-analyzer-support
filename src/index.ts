// Copyright (C) Microsoft Corp. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import type {CallSite, ErrorConstructor, StackTracePreparer} from './v8.js';

/**
 * Collects unique module information (name and hash).
 *
 * Precondition: `CallSite.getScriptHash` must be present. This function should only be called after verifying
 * that this function is available.
 *
 * @param frames The list of stack frames received from `Error.prepareStackTrace`.
 * @returns A string containing the source modules list, or undefined no script hashes were available.
 * @requires The `getScriptHash` function on `CallSite` must be present because it is asserted within this function.
 */
function collectModuleInformation(frames: CallSite[]): string | undefined {
  const sourceHashMap = new Map</* file name */ string, /* hash */ string>();
  for (const frame of frames) {
    const file = frame.getFileName();
    const hash = frame.getScriptHash!();
    if (file && hash) {
      sourceHashMap.set(file, hash);
    }
  }

  if (sourceHashMap.size) {
    const resultLines = ['', 'Source modules:'];
    for (const [file, hash] of sourceHashMap.entries()) {
      resultLines.push(`    ${file} ${hash}`);
    }

    return resultLines.join('\n');
  }

  return undefined;
}

let originalPST: StackTracePreparer|undefined;
/**
 * This is the "long-term" `prepareStackTrace` callback. It applies either the previous `prepareStackTrace` hook,
 * if one exists, or defers to the built-in stack generator provided by V8. After the previous stack is generated,
 * this collects a list of unique source module information, and outputs them to the end of the stack trace.
 *
 * @param error The error object to inspect.
 * @param frames The list of stack frames from V8.
 * @returns A string representing the stack trace, or undefined if we're not overriding it.
 */
function prepareStackTraceWithSourceModules(error: Error, frames: CallSite[]): string|undefined {
  let originalStack: string|undefined;
  if (originalPST) {
    // there was already a hook, so apply it here
    originalStack = originalPST.apply(Error, [error, frames]);
  }
  else {
    // prepareStackTrace guards against reentrancy, so we can just interrogate for the stack
    originalStack = error.stack;
  }

  const moduleInformation = collectModuleInformation(frames);
  if (moduleInformation) {
    return originalStack + '\n' + moduleInformation;
  }

  return originalStack;
}

/**
 * Installs a hook to collect source hash information if it is available. You should be able to install this
 * by writing:
 *
 * ```ts
 * installErrorStackModuleAnnotations(Error);
 * ```
 *
 * @param errorConstructor The `Error` constructor.
 */
export function installErrorStackModuleAnnotations(errorConstructor: ErrorConstructor): void {
  /**
   * This is the `prepareStackTrace` callback installed initially. The first time this function is called with
   * an array with one or more `CallSite` objects in `frames`, it tests to see whether the `getScriptHash()` function
   * is present. If it is not, it unhooks from execution. If it is present, it removes this hook, but installs the
   * `prepareStackTraceWithSourceModules` function above.
   *
   * @param error The error object to inspect.
   * @param frames The list of stack frames from V8.
   * @returns A string representing the stack trace, or undefined if we're not overriding it.
   */
  function firstPrepareStackTrace(error: Error, frames: CallSite[]): string|undefined {
    // During the first run, we need to ensure that the `getScriptHash`
    // function exists. If it is not, we excuse ourselves from execution.

    if (frames.length > 0) {
      if ('getScriptHash' in frames[0].constructor.prototype) {
        // Here we see that the engine is a sufficient version that supports retrieving the hash
        // from the `CallSite` object, so we install the hook and return the result of calling it.
        if (errorConstructor.prepareStackTrace === firstPrepareStackTrace) {
          // We can only install the hook directly if there hasn't been another hook overwriting us
          // in the call chain.
          errorConstructor.prepareStackTrace = prepareStackTraceWithSourceModules;
        }
        return prepareStackTraceWithSourceModules.apply(errorConstructor, [error, frames]);
      }

      // 'getScriptHash' is not present, which means the engine we're running on doesn't
      // support it. We need to unhook from execution.
      errorConstructor.prepareStackTrace = originalPST;
    }

    // If we've exited the block, it means that either there were no frames
    // or the engine didn't support it. Either way, we need to call the original
    // format function, if it exists, or fall back.

    if (typeof originalPST === 'function') {
      return originalPST.apply(errorConstructor, [error, frames]);
    }

    // Default back to conventional stack. V8 guards against reentrancy,
    // so this will not result in a stack overflow
    return error.stack;
  }

  // Don't install this hook multiple times. Can't prevent all cases, but at least this is
  // one guard.
  if (errorConstructor.prepareStackTrace?.name === 'firstPrepareStackTrace') {
    return;
  }

  originalPST = errorConstructor.prepareStackTrace;
  errorConstructor.prepareStackTrace = firstPrepareStackTrace;
}
