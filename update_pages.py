import os

dirs = ['tools', 'tasks', 'companies', 'news', 'videos', 'robots', 'devices', 'models', 'repositories', 'collections']
base_path = r'c:\Users\sahil salap\Desktop\ai-orbit\frontend\src\app'

for d in dirs:
    p = os.path.join(base_path, d, 'page.tsx')
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            content = f.read()
            if 'GlobalHero' not in content:
                content = content.replace('import { Header } from "@/components/Header";', 'import { Header } from "@/components/Header";\nimport { GlobalHero } from "@/components/GlobalHero";')
                content = content.replace('<Header />', '<Header />\n      <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>')
                with open(p, 'w', encoding='utf-8') as f2:
                    f2.write(content)
                print('Updated', p)
