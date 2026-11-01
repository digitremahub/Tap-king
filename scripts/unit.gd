extends Node3D

var destination := Vector3.ZERO
var moving := false
var move_speed := 4.0
var body_mesh: MeshInstance3D
var ring: MeshInstance3D

func _ready() -> void:
	destination = global_position
	_build_visual()
	_build_collision()

func _build_visual() -> void:
	body_mesh = MeshInstance3D.new()
	var mesh := CapsuleMesh.new()
	mesh.radius = 0.38
	mesh.height = 1.45
	body_mesh.mesh = mesh
	body_mesh.position.y = 0.72
	var material := StandardMaterial3D.new()
	material.albedo_color = Color(0.72, 0.76, 0.83)
	material.metallic = 0.12
	body_mesh.material_override = material
	add_child(body_mesh)

	ring = MeshInstance3D.new()
	var ring_mesh := CylinderMesh.new()
	ring_mesh.top_radius = 0.58
	ring_mesh.bottom_radius = 0.58
	ring_mesh.height = 0.035
	ring.mesh = ring_mesh
	ring.position.y = 0.03
	var ring_material := StandardMaterial3D.new()
	ring_material.albedo_color = Color(0.12, 0.85, 0.78)
	ring_material.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	ring.material_override = ring_material
	ring.visible = false
	add_child(ring)

func _build_collision() -> void:
	var area := Area3D.new()
	var shape_node := CollisionShape3D.new()
	var shape := SphereShape3D.new()
	shape.radius = 0.75
	shape_node.shape = shape
	shape_node.position.y = 0.7
	area.add_child(shape_node)
	add_child(area)

func _process(delta: float) -> void:
	if not moving:
		return
	var next_position := global_position.move_toward(destination, move_speed * delta)
	global_position = next_position
	if global_position.distance_to(destination) < 0.05:
		moving = false

func set_selected(value: bool) -> void:
	ring.visible = value

func move_to(target: Vector3) -> void:
	destination = Vector3(target.x, 0.0, target.z)
	moving = true
