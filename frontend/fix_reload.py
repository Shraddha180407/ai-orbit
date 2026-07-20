import re
import os

files_to_fix = [
    'src/components/tools-client.tsx',
    'src/components/collections-client.tsx',
    'src/components/news/NewsListingClient.tsx',
]

for file_path in files_to_fix:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the async function fetchXXX() inside useEffect
    match = re.search(r'(async function fetch\w+\(\) \{.*?\n    \})', content, re.DOTALL)
    if match:
        func_body = match.group(1)
        # Convert to const fetchXXX = async () => { ... }
        func_name = re.search(r'async function (fetch\w+)\(\)', func_body).group(1)
        new_func = func_body.replace(f'async function {func_name}()', f'const {func_name} = async () =>')
        
        # Replace the function inside useEffect with just the call
        content = content.replace(func_body, '')
        
        # Insert the new function right before useEffect
        use_effect_index = content.find('useEffect(() => {')
        content = content[:use_effect_index] + new_func + '\n\n  ' + content[use_effect_index:]
        
        # Replace window.location.reload() with func_name()
        content = content.replace('window.location.reload(); // Quick refresh to see changes', f'{func_name}();')
        content = content.replace('window.location.reload();', f'{func_name}();')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {file_path}")
    else:
        print(f"Could not find fetch function in {file_path}")

# For TopFilters.tsx, it's a server-passed component, we just want to useRouter refresh
with open('src/components/TopFilters.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'useRouter' not in content:
    content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { useRouter } from "next/navigation";')
    content = content.replace('const isAdmin = user?.role === \'ADMIN\';', 'const isAdmin = user?.role === \'ADMIN\';\n  const router = useRouter();')
    content = content.replace('window.location.reload();', 'router.refresh();')
    # Fix category ID issue: add ID check in openEdit
    content = content.replace('setEditingId(cat.id); // NOTE: TopFilters categories prop might not include id right now, we need to ensure it does.', 'if (!cat.id) { toast.error("Category ID missing"); return; }\n    setEditingId(cat.id);')

    with open('src/components/TopFilters.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed TopFilters.tsx")
