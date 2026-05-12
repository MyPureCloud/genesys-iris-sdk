export function getParameterId(
  contextId,
  parameterGroupName,
  parameterName,
  configs
) {
  const config = configs.filter((cfg) => cfg.contextId === contextId);
  if (!config || config.length === 0) return;

  const parameterGroup = config[0].parameters.filter(
    (pg) => pg.name === parameterGroupName
  );
  if (!parameterGroup || parameterGroup.length === 0) return;

  const parameter = parameterGroup[0].parameterDescriptions.filter(
    (param) => param.name === parameterName
  );
  if (!parameter || parameterGroup.length === 0) return;

  return parameter[0].id;
}
