import { useDispatch, useSelector } from 'react-redux'
import { ChevronDown, ChevronRight, FileText, Filter, CheckCircle } from 'lucide-react'
import { selectApplications, selectSelectedApp, selectApplication } from '../features/dashboard/dashboardSlice'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Sidebar() {
  const applications = useSelector(selectApplications)
  const selectedApp = useSelector(selectSelectedApp)
  const dispatch = useDispatch()
  const [expandedNodes, setExpandedNodes] = useState({})
  const [selectedNode, setSelectedNode] = useState(null)

  const handleToggleExpand = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }))
  }

  const handleNodeSelect = (nodeId, nodeLabel, nodeData) => {
    setSelectedNode({ id: nodeId, label: nodeLabel, data: nodeData })
  }

  return (
    <aside className="sidebar sidebar-tree-layout">
      <div className="sidebar-search-wrap">
        <button className="sidebar-icon-btn" type="button" aria-label="Open panel options">
          <FileText size={15} />
        </button>
        <div className="sidebar-search-field">
          <input className="sidebar-search" placeholder="Search" />
          <button className="sidebar-inline-btn" type="button" aria-label="Expand search options">
            <ChevronDown size={14} />
          </button>
        </div>
        <button className="sidebar-icon-btn" type="button" aria-label="Filter">
          <Filter size={15} />
        </button>
      </div>

      <div className="tree-panel">
        <div className="tree-header">
          <h3>SE Global</h3>
          <button type="button" aria-label="Add node">+</button>
        </div>
        <ul className="tree-list">
          {applications.map((app) => (
            <TreeNodeWithSelect
              key={app.id}
              node={{ id: app.id, label: app.name, children: app.nodes || [] }}
              isActive={selectedApp?.id === app.id}
              onAppSelect={(appId) => dispatch(selectApplication(appId))}
              onNodeSelect={handleNodeSelect}
              expandedNodes={expandedNodes}
              onToggleExpand={handleToggleExpand}
              selectedNode={selectedNode}
            />
          ))}
        </ul>
      </div>
    </aside>
  )
}

// Wrapper component to handle both app and node selection
function TreeNodeWithSelect({ node, level = 0, isActive = false, onAppSelect, onNodeSelect, expandedNodes, onToggleExpand, isLastChild = false, selectedNode }) {
  const navigate = useNavigate()
  const hasChildren = node.children?.length > 0
  const isExpanded = expandedNodes[node.id]
  const isNodeSelected = selectedNode?.id === node.id

  let nodeType = ''
  if (level === 0 || level === 1) {
    nodeType = 'Node'
  } else if (level === 2) {
    nodeType = 'Subnode'
  }

  const handleClick = () => {
    if (level === 0) {
      onAppSelect?.(node.id)
    } else {
      onNodeSelect?.(node.id, node.label, node)
      // Navigate to motor detail page if it's a motor
      if ((node.label === 'ESP Motor 1' || node.label === 'ESP Motor 2' || node.label === 'ESP Motor 3')) {
        navigate(`/motor/${node.id}`, { state: { motorNode: node } })
      }
    }
  }

  return (
    <li>
      <div className="tree-item-wrapper">
        {hasChildren && (
          <button
            type="button"
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(node.id)
            }}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        {!hasChildren && <div className="expand-btn-placeholder"></div>}
        <button
          type="button"
          className={`tree-item level-${level} ${isActive || isNodeSelected ? 'active' : ''}`}
          onClick={handleClick}
        >
          <span>
            {level === 1 && !isLastChild && <CheckCircle className="check-icon" style={{ color: '#22c55e' }} />}
            {level === 1 && isLastChild && <span className="check-icon" style={{ visibility: 'hidden' }} />}
            {node.label}
            {nodeType && (level === 0 || level === 1) && <span className="node-type-label"> ({nodeType})</span>}
            {nodeType && level === 2 && <span className="node-type-label"> ({nodeType})</span>}
          </span>
        </button>
      </div>
      {hasChildren && isExpanded && (
        <ul className="tree-list nested">
          {node.children.map((child, index) => (
            <TreeNodeWithSelect
              key={child.id}
              node={child}
              level={level + 1}
              onNodeSelect={onNodeSelect}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              isLastChild={index === node.children.length - 1}
              selectedNode={selectedNode}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default Sidebar
