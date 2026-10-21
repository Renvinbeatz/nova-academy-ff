declare namespace Cloudflare {
  interface Env {
    COURSE_IMPORT_KEY?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
