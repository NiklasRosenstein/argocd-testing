/**
 * Defines ArgoCD projects, repositories and applications.
 */

import { Application, Repository } from "jsr:@gin/argocd-v1alpha1/crds";
import { Gin, SecretValue } from "jsr:@gin/core";

const REPOSITORY = "https://github.com/NiklasRosenstein/argocd-testing.git"

interface GinApplication {
  name: string;
  deno?: {
    allowWrite?: string[];
    allowRead?: string[];
    allowRun?: string[];
  };
}

function createApplication(app: GinApplication): Application {
  return {
    apiVersion: "argoproj.io/v1alpha1",
    kind: "Application",
    metadata: {
      name: app.name,
      namespace: "argocd",
    },
    spec: {
      project: "default",
      destination: {
        server: "https://kubernetes.default.svc",
      },
      source: {
        repoURL: REPOSITORY,
        targetRevision: "HEAD",
        path: ".",
        plugin: {
          name: "gin-v1",
          parameters: [
            { name: "script", string: "main.ts" },
            { name: "args", array: [app.name] },
            {
              name: "deno_allow_write",
              array: ["/tmp/gin", ...app.deno?.allowWrite ?? []],
            },
            {
              name: "deno_allow_read",
              array: ["/tmp/gin", ...app.deno?.allowRead ?? []],
            },
            {
              name: "deno_allow_run",
              array: ["helm", ...app.deno?.allowRun ?? []],
            },
          ],
        },
      },
    },
  };
}

export default (gin: Gin) => {
  gin.emit<Repository>({
    apiVersion: "v1",
    kind: "Secret",
    metadata: {
      name: "my-repo",
      namespace: "argocd",
      labels: {
        "argocd.argoproj.io/secret-type": "repository",
      },
    },
    stringData: {
      name: "my-repo",
      project: "default",
      type: "git",
      url: REPOSITORY,
    },
  });

  gin.emit<Application>(createApplication({ name: "argocd" }));
  gin.emit<Application>(createApplication({ name: "argocd-apps" }));
};
