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
  const [globalStock, setGlobalStock] = useState<string>('0');

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

      {/* Apply stock to all selected sizes */}
      {value.length > 0 && (
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#666' }}>
              Apply stock to all
            </label>
            <input
              type="number"
              value={globalStock}
              onChange={(e) => setGlobalStock(e.target.value)}
              min="0"
              placeholder="Enter stock qty"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const qty = Math.max(0, Number(globalStock) || 0);
              const updated = value.map((s) => ({ ...s, stockQuantity: qty }));
              onChange(updated);
            }}
            style={{
              padding: '8px 16px',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              whiteSpace: 'nowrap',
            }}
          >
            Apply to All
          </button>
        </div>
      )}

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
