/**
 * Defines ArgoCD projects, repositories and applications.
 */

import { GinApplication, GitRepository } from "@gin/argocd-v1alpha1/shortcuts";
import { Gin } from "@gin/core";

const REPOSITORY = "https://github.com/NiklasRosenstein/argocd-testing.git";

export default (gin: Gin) => {
  gin.emit(GitRepository({
    name: "my-repo",
    project: "default",
    url: REPOSITORY,
  }));
  gin.emit(GinApplication({
    name: "argocd",
    script: "main.ts",
    args: ["argocd-apps"],
    repository: REPOSITORY,
  }));
  gin.emit(GinApplication({
    name: "argocd-apps",
    script: "main.ts",
    repository: REPOSITORY,
    args: ["argocd-apps"],
  }));
};
