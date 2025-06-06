import { Gin } from "jsr:@gin/core";
import { HelmOptions } from "jsr:@gin/helm-v1alpha1";

export const gin = new Gin()
  // Use a directory outside of the CWD to avoid loosing the cache.
  // See https://github.com/NiklasRosenstein/gin/issues/6
  .withOptions<HelmOptions>({
    pkg: "@gin/helm-v1alpha1",
    cacheDir: "/tmp/gin",
  });

if (import.meta.main) {
  const script = Deno.args[0]!;
  const pipeline: (gin: Gin) => Promise<void> | void = await import(
    `./${script}.ts`
  ).then((m) => m.default);
  console.warn(`Running Gin pipeline}`, pipeline);
  await gin.run(pipeline);
}
