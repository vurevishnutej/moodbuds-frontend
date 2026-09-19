import { useState } from 'react';

export interface SizeStock {
  size: string;
  stockQuantity: number;
  lowStockThreshold: number;
  available: boolean;
}

interface SizeStockManagerProps {
  value: SizeStock[];
  onChange: (stocks: SizeStock[]) => void;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function SizeStockManager({ value, onChange }: SizeStockManagerProps) {
  const [globalThreshold, setGlobalThreshold] = useState<string>('5');

  const updateSize = (size: string, field: keyof SizeStock, newValue: any) => {
    const updated = value.map((s) =>
      s.size === size ? { ...s, [field]: newValue } : s
    );
    onChange(updated);
  };

  const toggleSize = (size: string) => {
    const exists = value.some((s) => s.size === size);
    if (exists) {
      onChange(value.filter((s) => s.size !== size));
    } else {
      onChange([
        ...value,
        {
          size,
          stockQuantity: 0,
          lowStockThreshold: Number(globalThreshold) || 5,
          available: true,
        },
      ]);
    }
  };

  return (
    <div className="adm-form-group">
      <label className="adm-label">Sizes & Stock Inventory</label>

      {/* Quick select all sizes */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {AVAILABLE_SIZES.map((size) => (
          <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              checked={value.some((s) => s.size === size)}
              onChange={() => toggleSize(size)}
            />
            <span>{size}</span>
          </label>
        ))}
      </div>

      {/* Stock management table */}
      {value.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600 }}>Size</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600 }}>
                  Stock Qty
                </th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600 }}>
                  Low Stock Alert
                </th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600 }}>
                  Available
                </th>
              </tr>
            </thead>
            <tbody>
              {value.map((stock, idx) => (
                <tr key={stock.size} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <strong>{stock.size}</strong>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <input
                      type="number"
                      value={stock.stockQuantity}
                      onChange={(e) =>
                        updateSize(stock.size, 'stockQuantity', Math.max(0, Number(e.target.value)))
                      }
                      min="0"
                      style={{
                        width: '80px',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                    />
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <input
                      type="number"
                      value={stock.lowStockThreshold}
                      onChange={(e) =>
                        updateSize(
                          stock.size,
                          'lowStockThreshold',
                          Math.max(0, Number(e.target.value))
                        )
                      }
                      min="0"
                      style={{
                        width: '80px',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                    />
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <input
                      type="checkbox"
                      checked={stock.available}
                      onChange={(e) => updateSize(stock.size, 'available', e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            padding: '16px',
            background: '#f5f5f5',
            textAlign: 'center',
            color: '#999',
            borderRadius: '4px',
          }}
        >
          Select sizes above to manage stock inventory
        </div>
      )}
    </div>
  );
}
