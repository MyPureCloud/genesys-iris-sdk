// Create a map of parameter IDs and Context IDs from the return value of
// createAudioContext().
export function createParameterMap(contexts) {
  const parameterMap = {};
  for (const context in contexts) {
    const processor = {};
    for (const parameter of contexts[context].parameters) {
      const param = {};
      for (const description of parameter.parameterDescriptions) {
        param[description.name] = {
          contextId: contexts[context].contextId,
          paramId: description.id
        };
      }
      processor[parameter.id] = param;
    }
    parameterMap[contexts[context].instance] = processor;
  }
  return parameterMap;
}
// Return the parameter and context IDs of the parameter you need
export function getParameterDetails(
  contextNum,
  processor,
  param,
  parameterMap
) {
  if (!parameterMap) {
    console.error('No parameterMap');
    return;
  }
  if (!parameterMap[contextNum]) {
    console.error(`No contextNum ${contextNum} in parameterMap`);
    return;
  }
  if (!parameterMap[contextNum][processor]) {
    console.error(
      `No processor ${processor} in contextNum ${contextNum} of parameterMap`
    );
    return;
  }
  if (!parameterMap[contextNum][processor][param]) {
    console.error(
      `No parameter ${param} of processor ${processor} in contextNum ${contextNum} of parameterMap`
    );
    return;
  }
  return parameterMap[contextNum][processor][param];
}
