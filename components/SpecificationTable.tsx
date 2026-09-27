import React from 'react';
import { IProduct } from '../types';

interface SpecificationTableProps {
  product: IProduct;
}

export const SpecificationTable: React.FC<SpecificationTableProps> = ({ product }) => {
  const specs = product.technicalSpecifications || {};

  // Build key-value pairs strictly from configured fields
  const rows: Array<{ label: string; value: string | undefined }> = [
    { label: 'Material', value: specs.material || product.material },
    { label: 'Product Type', value: specs.productType || product.subcategory },
    { label: 'Nominal Diameter', value: specs.diameter || product.diameter },
    { label: 'Standard Length', value: specs.length || product.length },
    { label: 'Finish / Color', value: specs.color || product.color },
    { label: 'Primary Application', value: specs.application || product.application },
    { label: 'Connection Type', value: specs.connectionType },
    { label: 'Pressure Rating', value: specs.pressureRating || product.pressureRating },
    { label: 'Standard Compliance', value: specs.standardCompliance },
    { label: 'Wall Thickness', value: specs.wallThickness },
    { label: 'Operating Temperature', value: specs.operatingTemp },
    { label: 'Manufacturing Brand', value: product.brand },
    { label: 'Stock Keeping Unit (SKU)', value: product.sku },
    {
      label: 'Inventory Status',
      value: product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock (Quote Required)',
    },
  ].filter((item) => item.value !== undefined && item.value.trim() !== '');

  if (rows.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 text-slate-500 text-xs italic">
        No technical specifications configured for this item. Contact our Multan shop at +92-61-4540198 for catalog details.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-300 rounded shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-[#17212B] text-white font-tech uppercase tracking-wider text-[11px]">
            <th className="py-2.5 px-4 font-semibold w-1/3 border-r border-slate-700">Technical Parameter</th>
            <th className="py-2.5 px-4 font-semibold">Factory Specification & Standard</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 font-mono-spec">
          {rows.map((row, idx) => (
            <tr
              key={row.label}
              className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-[#F4F8FA] hover:bg-slate-100'}
            >
              <td className="py-2.5 px-4 font-semibold text-slate-700 border-r border-slate-200">
                {row.label}
              </td>
              <td className="py-2.5 px-4 text-slate-900 font-medium">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
