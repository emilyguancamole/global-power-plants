//  Create a line chart that shows the annual
// electricity generation for one or more selected countries based on the available
// dataset. The chart should automatically update whenever the selected country or
// countries change. Users must be able to select up to two countries for comparison.

import { useEffect, useState } from "react";
import type { GenerationOverTimeType } from "../data/types";

//'/:code/generation-over-time'
const CountryGenerationChart = () => {
  const [genData, setGenData] = useState<GenerationOverTimeType[]>([]);

  useEffect(() => {});
};
