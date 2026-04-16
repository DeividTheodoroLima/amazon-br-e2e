import environments from "./env.json";

interface EnvironmentProject {
  baseUrl: string;
}

interface EnvironmentDefinition {
  web?: EnvironmentProject;
  dev?: EnvironmentProject;
}

type EnvironmentMap = Record<string, EnvironmentDefinition>;

export interface ResolvedEnvironment {
  name: string;
  baseUrl: string;
}

const environmentMap = environments as EnvironmentMap;

export function resolveEnvironmentConfig(envName = "prod"): ResolvedEnvironment {
  const environment = environmentMap[envName];

  if (!environment) {
    throw new Error(
      `Ambiente "${envName}" não encontrado em env.json. Ambientes disponíveis: ${Object.keys(environmentMap).join(", ")}`,
    );
  }

  const project = environment.web ?? environment.dev;

  if (!project?.baseUrl) {
    throw new Error(
      `Ambiente "${envName}" não possui baseUrl válida configurada em env.json.`,
    );
  }

  return {
    name: envName,
    baseUrl: project.baseUrl,
  };
}

export default {
  resolveEnvironmentConfig,
};
