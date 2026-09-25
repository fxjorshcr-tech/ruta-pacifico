/**
 * Which image sources next/image may run through the optimizer.
 *
 * Only site-relative paths and the Supabase Storage bucket are allowed by
 * `images.remotePatterns` in next.config.ts; a blog cover hosted anywhere
 * else would make next/image throw at render time, so those are passed
 * through untouched.
 */
const SUPABASE_PUBLIC_STORAGE =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/";

export function isOptimizable(src: string): boolean {
  return src.startsWith("/") || src.startsWith(SUPABASE_PUBLIC_STORAGE);
}
