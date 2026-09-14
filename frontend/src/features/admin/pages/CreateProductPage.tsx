import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminModuleBar, AdminBody, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_MOODS, adminThumb } from '../../../data/admin';
import { useToast } from '../../../app/providers/ToastProvider';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export function CreateProductPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [moodIdx, setMoodIdx] = useState(0);
  const [sizes, setSizes] = useState<boolean[]>(SIZES.map((_, i) => i > 0 && i < 4));

  return (
    <>
      <AdminModuleBar
        title="Create Product"
        sub="Add a new piece to the catalog"
        actions={
          <>
            <button type="button" className="adm-btn ghost" onClick={() => navigate('/profile/admin/edit-products')}>Cancel</button>
            <button type="button" className="adm-btn rose" onClick={() => toast.info('Product saved as draft')}>Save draft</button>
            <button type="button" className="adm-btn primary" onClick={() => toast.success('Product published ✦')}>Publish</button>
          </>
        }
      />
      <AdminBody>
        <div className="adm-form-grid">
          <div>
            <div className="adm-card">
              <div className="adm-card-head"><span className="adm-card-title">Product details</span></div>
              <div className="adm-card-body">
                <div className="adm-field"><label>Product name</label><input placeholder="e.g. Structured Blazer" /></div>
                <div className="adm-field-row">
                  <div className="adm-field"><label>Brand</label><input placeholder="The Boardroom" /></div>
                  <div className="adm-field"><label>SKU</label><input placeholder="MB-BLZ-001" /></div>
                </div>
                <div className="adm-field"><label>Description</label><textarea placeholder="Describe the piece, fabric, fit…" /></div>
                <div className="adm-field">
                  <label>Mood</label>
                  <div className="adm-chips">
                    {ADMIN_MOODS.map((m, i) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`adm-chip mood${i === moodIdx ? ' on' : ''}`}
                        style={i === moodIdx ? { background: m.color, color: '#131722' } : undefined}
                        onClick={() => setMoodIdx(i)}
                      >
                        {m.emoji} {m.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="adm-card">
              <div className="adm-card-head"><span className="adm-card-title">Pricing & inventory</span></div>
              <div className="adm-card-body">
                <div className="adm-field-row">
                  <div className="adm-field"><label>Price (₹)</label><input type="number" placeholder="3499" /></div>
                  <div className="adm-field"><label>MRP (₹)</label><input type="number" placeholder="4299" /></div>
                </div>
                <div className="adm-field-row">
                  <div className="adm-field"><label>Stock qty</label><input type="number" placeholder="24" /></div>
                  <div className="adm-field">
                    <label>Category</label>
                    <select><option>Dresses</option><option>Outerwear</option><option>Tops</option><option>Footwear</option><option>Accessories</option></select>
                  </div>
                </div>
                <div className="adm-field">
                  <label>Available sizes</label>
                  <div className="adm-chips">
                    {SIZES.map((s, i) => (
                      <button
                        key={s}
                        type="button"
                        className={`adm-chip${sizes[i] ? ' on' : ''}`}
                        onClick={() => setSizes((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="adm-card">
              <div className="adm-card-head"><span className="adm-card-title">Media</span></div>
              <div className="adm-card-body">
                <div className="adm-dropzone" onClick={() => toast.info('Image picker (demo)')}>
                  <div className="big">⬆</div>Drag images here or <b>browse</b>
                  <div style={{ fontSize: 11, marginTop: 6, color: '#bbb' }}>PNG / JPG up to 5MB</div>
                </div>
              </div>
            </div>
            <div className="adm-preview">
              <div className="adm-preview-h">Live preview</div>
              <div className="adm-pv-img"><img src={adminThumb(0)} alt="" /></div>
              <div className="adm-pv-brand">The Boardroom</div>
              <div className="adm-pv-name">Structured Blazer</div>
              <div className="adm-pv-price">₹3,499 <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through', fontWeight: 400 }}>₹4,299</span></div>
            </div>
          </div>
        </div>
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}
