/**
 * Defines ArgoCD projects, repositories and applications.
 */

import { GinApplication, GitRepository } from "@gin/argocd-v1alpha1/shortcuts";
import { Gin } from "@gin/core";

const REPOSITORY = "https://github.com/NiklasRosenstein/argocd-testing.git";

new Gin().run((gin) => {
  gin.emit(
    GitRepository({ name: "my-repo", project: "default", url: REPOSITORY }),
  );
  gin.emit(
    GinApplication({
      name: "argocd",
      script: "argocd.ts",
      repository: REPOSITORY,
    }),
  );
  gin.emit(
    GinApplication({
      name: "argocd-apps",
      script: "argocd-apps.ts",
      repository: REPOSITORY,
    }),
  );
});
