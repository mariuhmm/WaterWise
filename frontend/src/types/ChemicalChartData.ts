export interface ChemicalChartData {
    labels: Array<string>;
    values: Array<number>;
    unitOfMeasure: string;
    chemicalName: string | null | undefined;
}