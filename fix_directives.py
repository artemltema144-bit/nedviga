import os

files = [
    "src/app/profile/page.tsx",
    "src/app/messages/page.tsx",
    "src/app/messages/[id]/page.tsx",
    "src/app/ads/create/page.tsx"
]

for filepath in files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        lines = f.readlines()

    # Check if "use client" exists in the first few lines
    has_use_client = False
    for i in range(min(5, len(lines))):
        if '"use client"' in lines[i] or "'use client'" in lines[i]:
            has_use_client = True
            use_client_line = lines.pop(i)
            lines.insert(0, use_client_line)
            break

    with open(filepath, 'w') as f:
        f.writelines(lines)
