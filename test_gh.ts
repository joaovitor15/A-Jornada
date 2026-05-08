async function test() {
  const res = await fetch('https://api.github.com/repos/RoyaleAPI/cr-api-assets/git/trees/master?recursive=1');
  const d = await res.json();
  const paths = d.tree?.map((x: any) => x.path);
  console.log(paths.filter((x: string) => x.toLowerCase().includes('mastery') || x.toLowerCase().includes('badge')));
}
test();
