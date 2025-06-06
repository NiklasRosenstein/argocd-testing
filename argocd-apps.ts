/**
 * Defines ArgoCD projects, repositories and applications.
 */

import { Repository } from "jsr:@gin/argocd-v1alpha1/types";
import { Gin, SecretValue } from "jsr:@gin/core";

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
      url: "ssh://git@github.com/NiklasRosenstein/argocd-testing.git",
      sshPrivateKey: SecretValue.of(
        new TextDecoder().decode(Deno.readFileSync("./deploy")),
      ),
    },
  });

  gin.emit({
    apiVersion: "argoproj.io/v1alpha1",
    kind: "Application",
    metadata: {
      name: "argocd",
      namespace: "argocd",
    },
    spec: {
      project: "default",
      destination: {
        server: "https://kubernetes.default.svc",
      },
      source: {
        repoURL: "ssh://git@github.com/NiklasRosenstein/argocd-testing.git",
        targetRevision: "HEAD",
        path: ".",
        plugin: {
          name: "gin-v1",
          parameters: [
            { name: "script", string: "main.ts" },
            { name: "args:", array: ["argocd"] },
          ]
        }
      }
    }
  })

}
