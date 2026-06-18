import bpy
import sys

src = sys.argv[sys.argv.index('--') + 1]
dst = sys.argv[sys.argv.index('--') + 2]

# Clear default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Import GLB
bpy.ops.import_scene.gltf(filepath=src)

# Keep only city and bike
keep = {'city', 'bike'}
for obj in bpy.context.scene.objects:
    if obj.name.lower() not in keep:
        bpy.data.objects.remove(obj, do_unlink=True)

# Export cleaned GLB
bpy.ops.export_scene.gltf(
    filepath=dst,
    export_format='GLB',
    export_yup=True,
    export_apply=True,
)
print(f'Exported {dst}')
