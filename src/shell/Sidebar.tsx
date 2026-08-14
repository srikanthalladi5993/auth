import { useDispatch, useSelector } from 'react-redux'
import { ChevronDown, ChevronRight, FileText, Filter, CheckCircle } from 'lucide-react'
import { selectApplications, selectSelectedApp, selectApplication, moveTreeItem } from '../features/dashboard/dashboardSlice'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Sidebar() {
  const applications = useSelector(selectApplications)
  const selectedApp = useSelector(selectSelectedApp)
  const dispatch = useDispatch()
  const [expandedNodes, setExpandedNodes] = useState({})
  const [selectedNode, setSelectedNode] = useState(null)
  const [dragState, setDragState] = useState(null)
  const [dragOverTarget, setDragOverTarget] = useState(null)
  const [recentlyDropped, setRecentlyDropped] = useState(null)

  useEffect(() => {
    if (!recentlyDropped) {
      return undefined
    }

    const timeoutId = setTimeout(() => setRecentlyDropped(null), 500)

    return () => clearTimeout(timeoutId)
  }, [recentlyDropped])

  const handleToggleExpand = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }))
  }

  const handleNodeSelect = (nodeId, nodeLabel, nodeData) => {
    setSelectedNode({ id: nodeId, label: nodeLabel, data: nodeData })
  }

  const handleDragStart = (event, kind, id) => {
    const payload = { kind, id }

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify(payload))
    event.dataTransfer.setData('text/plain', JSON.stringify(payload))
    setDragState(payload)
  }

  const handleDragOver = (event, kind, id, position = 'inside') => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'move'
    setDragOverTarget({ kind, id, position })
  }

  const handleDrop = (event, kind, id) => {
    event.preventDefault()
    event.stopPropagation()

    const rawPayload = event.dataTransfer.getData('application/json') || event.dataTransfer.getData('text/plain')
    let payload = dragState

    if (rawPayload) {
      try {
        payload = JSON.parse(rawPayload)
      } catch {
        payload = dragState
      }
    }

    if (payload?.id && payload?.kind) {
      setRecentlyDropped({
        kind,
        id,
        position: dragOverTarget?.position ?? 'inside',
      })

      dispatch(
        moveTreeItem({
          sourceId: payload.id,
          sourceKind: payload.kind,
          targetId: id,
          targetKind: kind,
          position: dragOverTarget?.position ?? 'inside',
        })
      )
    }

    setDragState(null)
    setDragOverTarget(null)
  }

  const handleDragEnd = () => {
    setDragState(null)
    setDragOverTarget(null)
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
          {!applications.length && (
            <li>
              <div className="tree-item level-0">No applications enabled</div>
            </li>
          )}
          {applications.map((app) => (
            <li key={app.id} className="tree-app-wrapper">
              <div
                className={`tree-sort-drop-zone ${dragOverTarget?.id === app.id && dragOverTarget?.kind === 'application' && dragOverTarget?.position === 'before' ? 'drag-over' : ''}`}
                onDragOver={(event) => handleDragOver(event, 'application', app.id, 'before')}
                onDrop={(event) => handleDrop(event, 'application', app.id)}
              />
              <TreeNodeWithSelect
                node={{ id: app.id, label: app.name, children: app.nodes || [] }}
                applicationId={app.id}
                isActive={selectedApp?.id === app.id}
                onAppSelect={(appId) => dispatch(selectApplication(appId))}
                onNodeSelect={handleNodeSelect}
                expandedNodes={expandedNodes}
                onToggleExpand={handleToggleExpand}
                selectedNode={selectedNode}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                dragState={dragState}
                dragOverTarget={dragOverTarget}
                recentlyDropped={recentlyDropped}
              />
              <div
                className={`tree-sort-drop-zone ${dragOverTarget?.id === app.id && dragOverTarget?.kind === 'application' && dragOverTarget?.position === 'after' ? 'drag-over' : ''}`}
                onDragOver={(event) => handleDragOver(event, 'application', app.id, 'after')}
                onDrop={(event) => handleDrop(event, 'application', app.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

// Wrapper component to handle both app and node selection
function TreeNodeWithSelect({
  node,
  level = 0,
  applicationId,
  isActive = false,
  onAppSelect,
  onNodeSelect,
  expandedNodes,
  onToggleExpand,
  isLastChild = false,
  selectedNode,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  dragState,
  dragOverTarget,
  recentlyDropped,
}) {
  const navigate = useNavigate()
  const hasChildren = node.children?.length > 0
  const isExpanded = expandedNodes[node.id]
  const isNodeSelected = selectedNode?.id === node.id
  const kind = level === 0 ? 'application' : 'node'
  const isDragging = dragState?.id === node.id && dragState?.kind === kind
  const isDropTarget = dragOverTarget?.id === node.id && dragOverTarget?.kind === kind
  const isDropBefore = dragOverTarget?.id === node.id && dragOverTarget?.kind === kind && dragOverTarget?.position === 'before'
  const isDropAfter = dragOverTarget?.id === node.id && dragOverTarget?.kind === kind && dragOverTarget?.position === 'after'
  const isRecentlyDropped = recentlyDropped?.id === node.id && recentlyDropped?.kind === kind

  const updateDropPosition = (event, targetKind, targetId) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const offsetY = event.clientY - bounds.top
    const beforeThreshold = bounds.height * 0.4
    const afterThreshold = bounds.height * 0.6
    const position = offsetY < beforeThreshold ? 'before' : offsetY > afterThreshold ? 'after' : 'inside'

    onDragOver?.(event, targetKind, targetId, position)
  }

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
      {level > 0 && dragState && (
        <div
          className={`tree-sort-drop-zone tree-sort-drop-zone--child ${isDropBefore ? 'drag-over' : ''}`}
          onDragOver={(event) => onDragOver?.(event, 'node', node.id, 'before')}
          onDrop={(event) => onDrop?.(event, 'node', node.id)}
        />
      )}
      <div
        className={`tree-item-wrapper ${isDragging ? 'dragging' : ''} ${isDropTarget ? 'drag-over' : ''} ${isRecentlyDropped ? 'drop-success' : ''}`}
        data-drop-position={dragOverTarget?.id === node.id && dragOverTarget?.kind === kind ? dragOverTarget?.position : undefined}
        draggable
        onDragStart={(event) => onDragStart?.(event, kind, node.id)}
        onDragOver={(event) => updateDropPosition(event, kind, node.id)}
        onDrop={(event) => onDrop?.(event, kind, node.id)}
        onDragEnd={onDragEnd}
      >
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
      {level > 0 && dragState && (
        <div
          className={`tree-sort-drop-zone tree-sort-drop-zone--child ${isDropAfter ? 'drag-over' : ''}`}
          onDragOver={(event) => onDragOver?.(event, 'node', node.id, 'after')}
          onDrop={(event) => onDrop?.(event, 'node', node.id)}
        />
      )}
      {level === 0 && dragState && (
        <div
          className={`tree-drop-zone ${dragOverTarget?.id === node.id && dragOverTarget?.kind === 'application' && dragOverTarget?.position === 'inside' ? 'drag-over' : ''}`}
          onDragOver={(event) => onDragOver?.(event, 'application', node.id, 'inside')}
          onDrop={(event) => onDrop?.(event, 'application', node.id)}
        />
      )}
      {hasChildren && isExpanded && (
        <ul
          className="tree-list nested"
          onDragOver={(event) => onDragOver?.(event, level === 0 ? 'application' : 'node', node.id, 'inside')}
          onDrop={(event) => onDrop?.(event, level === 0 ? 'application' : 'node', node.id)}
        >
          {node.children.map((child, index) => (
            <TreeNodeWithSelect
              key={child.id}
              node={child}
              applicationId={applicationId}
              level={level + 1}
              onAppSelect={onAppSelect}
              onNodeSelect={onNodeSelect}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              isLastChild={index === node.children.length - 1}
              selectedNode={selectedNode}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              dragState={dragState}
              dragOverTarget={dragOverTarget}
              recentlyDropped={recentlyDropped}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default Sidebar
