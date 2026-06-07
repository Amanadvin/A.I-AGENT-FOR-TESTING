import { NextResponse } from "next/server";

// Using Sets for O(1) lookups and cleaner management
const ALLOWED_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".md",
  ".py",
  ".java",
  ".cpp",
  ".c",
  ".cs",
  ".go",
  ".php",
  ".rb",
]);

const IGNORE_PATHS = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
  ".git",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "__pycache__",
  ".pytest_cache",
  "venv",
  ".env",
]);

function isUsefulFile(path: string): boolean {
  const lowerPath = path.toLowerCase();
  
  // Split path into individual segments to avoid accidental partial matches
  // (e.g., matching "src/components/button.tsx" against ".git" or "package-lock.json")
  const pathSegments = lowerPath.split("/");

  // Check if any directory or the exact filename is in the ignore list
  const isIgnored = pathSegments.some((segment) => IGNORE_PATHS.has(segment));
  if (isIgnored) return false;

  // Extract extension accurately
  const lastDotIndex = lowerPath.lastIndexOf(".");
  if (lastDotIndex === -1) return false;

  const ext = lowerPath.substring(lastDotIndex);
  return ALLOWED_EXTENSIONS.has(ext);
}

async function getRepoTree(
  owner: string,
  repo: string,
  branch: string,
  token?: string
) {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "AI-Testing-Automation-Agent",
  };

  // Use standard Bearer token format for GitHub API
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Step 1: Get branch details to find the latest tree SHA
  const branchUrl = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`;
  console.log("Branch URL:", branchUrl);

  const branchResponse = await fetch(branchUrl, {
    headers,
    cache: "no-store",
  });

  if (!branchResponse.ok) {
    const errorText = await branchResponse.text();
    throw new Error(
      `Failed to fetch branch "${branch}": ${branchResponse.status} ${errorText}`
    );
  }

  const branchData = await branchResponse.json();
  const treeSha = branchData?.commit?.commit?.tree?.sha;

  if (!treeSha) {
    throw new Error("Could not determine repository tree SHA.");
  }

  console.log("Tree SHA:", treeSha);

  // Step 2: Fetch full recursive tree structure
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`;
  console.log("Tree URL:", treeUrl);

  const treeResponse = await fetch(treeUrl, {
    headers,
    cache: "no-store",
  });

  if (!treeResponse.ok) {
    const errorText = await treeResponse.text();
    throw new Error(
      `Failed to fetch repo tree: ${treeResponse.status} ${errorText}`
    );
  }

  const data = await treeResponse.json();

  if (!data.tree || !Array.isArray(data.tree)) {
    return [];
  }

  // Filter only file blobs that pass our structural checks
  const usefulFiles = data.tree
    .filter((item: any) => item.type === "blob")
    .filter((item: any) => isUsefulFile(item.path));

  console.log(
    "Useful Files Found:",
    usefulFiles.map((file: any) => file.path)
  );

  return usefulFiles;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const owner = body.owner;
    const repo = body.repo;
    const branch = body.branch || "main";
    const token = body.token; // Extracted token passed from the frontend request

    console.log("Owner:", owner);
    console.log("Repo:", repo);
    console.log("Branch:", branch);
    console.log("Token Provided:", token ? "Yes" : "No");

    if (!owner || !repo) {
      return NextResponse.json(
        {
          error: "Missing repository details (owner or repo)",
        },
        { status: 400 }
      );
    }

    const repoFiles = await getRepoTree(owner, repo, branch, token);

    // Limit output to the first 25 files to preserve memory/payload size limits
    const validFiles = repoFiles.slice(0, 25);

    console.log("Total Filtered Files Count:", repoFiles.length);
    console.log("Capped Files Count:", validFiles.length);

    if (validFiles.length === 0) {
      return NextResponse.json(
        {
          error: "No useful source files found matching target extensions",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      totalFiles: repoFiles.length,
      returnedFilesCount: validFiles.length,
      files: validFiles.map((f: any) => f.path),
      message: "Repository scanned successfully",
    });
  } catch (error: any) {
    console.error(
      "Critical Failure inside Generation Agent Route:",
      error
    );

    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}