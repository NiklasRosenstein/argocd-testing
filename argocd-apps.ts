/**
 * Defines ArgoCD projects, repositories and applications.
 */

import { GinApplication, GitRepository } from "@gin/argocd-v1alpha1/shortcuts";
import { Gin } from "@gin/core";

const REPOSITORY = "https://github.com/NiklasRosenstein/argocd-testing.git";

new Gin().run(async (gin) => {
  gin.emit(
    GitRepository({ name: "my-repo", project: "default", url: REPOSITORY }),
  );

  for await (const entry of Deno.readDir(".")) {
    if (entry.isFile && entry.name.endsWith(".ts")) {
      gin.emit(
        GinApplication({
          name: entry.name.replace(/\.ts$/, ""),
          script: entry.name,
          repository: REPOSITORY,
          deno: entry.name == "argocd-apps.ts"
            ? {
              allowRead: ["."],
            }
            : {},
        }),
      );
    }
  }
});
