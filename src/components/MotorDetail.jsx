import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import espMotorImage from '../assets/esp-motor-pump.png'

function MotorDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const motorNode = location.state?.motorNode

  if (!motorNode || !motorNode.assetDetails) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Motor data not found</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    )
  }

  const details = motorNode.assetDetails

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#fff' }}>
      {/* Back button at top left */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#1f3a56',
          fontSize: '0.9rem',
          fontWeight: '600',
          zIndex: 10,
        }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Left side - Motor image placeholder */}
      <div
        style={{
          flex: '0 0 40%',
          padding: '60px 20px 20px 20px',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
        }}
      >
        <img
          src={espMotorImage}
          alt="ESP Motor Pump Diagram"
          style={{
            maxWidth: '100%',
            maxHeight: '500px',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Right side - Asset Details */}
      <div
        style={{
          flex: '0 0 60%',
          padding: '60px 30px 30px 30px',
          overflowY: 'auto',
          maxHeight: '100vh',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', fontWeight: '700', color: '#1f3a56' }}>
            {motorNode.label}
          </h2>
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              padding: '6px 12px',
              borderRadius: '4px',
              display: 'inline-block',
              fontSize: '0.8rem',
              color: '#22c55e',
              fontWeight: '600',
            }}
          >
            ● RUNNING
          </div>
        </div>

        {/* Manufacturer and Model */}
        <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>
              Manufacturer
            </label>
            <select
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.9rem',
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
              defaultValue="MFG-2"
            >
              <option value="MFG-1">MFG-1</option>
              <option value="MFG-2">MFG-2</option>
              <option value="MFG-3">MFG-3</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>
              Model
            </label>
            <input
              type="text"
              defaultValue="D725N"
              readOnly
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.9rem',
                backgroundColor: '#f9fafb',
              }}
            />
          </div>
        </div>

        {/* Asset Details Section */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '600', color: '#1f3a56' }}>
            Asset Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', fontSize: '0.9rem' }}>
            {/* VSD Efficiency */}
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                VSD Efficiency:
              </label>
              <input
                type="text"
                value={details.vsdEfficiency}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Power Factor */}
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                Power Factor of the motor:
              </label>
              <input
                type="text"
                value={details.powerFactor}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* VSD Amp Nameplate */}
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                VSD Amp Nameplate (A):
              </label>
              <input
                type="text"
                value={details.vsdAmpNameplate}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Motor Amp Nameplate */}
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                Motor Amp Nameplate (A):
              </label>
              <input
                type="text"
                value={details.motorAmpNameplate}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Pump shaft HP */}
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                Pump shaft HP (hp):
              </label>
              <input
                type="text"
                value={details.pumpShaftHP}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Seal shaft HP */}
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                Seal shaft HP (hp):
              </label>
              <input
                type="text"
                value={details.sealShaftHP}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Motor Efficiency */}
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                Motor Efficiency:
              </label>
              <input
                type="text"
                value={details.motorEfficiency}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Pump Efficiency */}
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                Pump Efficiency:
              </label>
              <input
                type="text"
                value={details.pumpEfficiency}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Flow Factor */}
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                Flow Factor:
              </label>
              <input
                type="text"
                value={details.flowFactor}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Gas Percentage */}
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                Gas Percentage:
              </label>
              <input
                type="text"
                value={details.gasPercentage}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            style={{
              flex: 1,
              padding: '10px 16px',
              background: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            Generate
          </button>
          <button
            style={{
              flex: 1,
              padding: '10px 16px',
              background: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            Modify
          </button>
        </div>
      </div>
    </div>
  )
}

export default MotorDetail
