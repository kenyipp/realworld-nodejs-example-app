/**
 *
 * This type AnyFunction defines a function that takes any number of arguments of unknown types
 * and returns either a value of unknown type or a Promise that resolves to a value of unknown type.
 *
 * The function can be synchronous or asynchronous (i.e., return a Promise).
 *
 */
export type AnyFunction = (...args: unknown[]) => Promise<unknown> | unknown;
