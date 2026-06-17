"""athena_mcp/server.py
ATHENA MCP Server entry point (used by PyPI / uvx install).

When installed via `pip install athena-mcp` or `uvx athena-mcp`, this module
is the entry point. It adds the installed package's root to sys.path so that
sibling packages (agents, core, hermes, interfaces) are importable, then
starts the MCP server over stdio.
"""

from __future__ import annotations

import sys
from pathlib import Path

# When installed via pip/uvx the layout is:
#   site-packages/
#     athena_mcp/       ← __file__ lives here
#     agents/
#     core/
#     hermes/
#     interfaces/
# Parent of athena_mcp == site-packages root, which is already on sys.path.
# When running directly from the repo, parent is the repo root — also fine.
_ROOT = Path(__file__).parent.parent.resolve()
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("ATHENA")


@mcp.tool()
def athena_swarm(goal: str, project_root: str = "") -> str:
    """Run the full ATHENA multi-agent swarm (Architect → Coder → Tester → Scribe).

    Best for non-trivial coding goals that benefit from design, implementation,
    testing, and documentation phases.

    Args:
        goal: High-level coding goal in plain English.
        project_root: Absolute path to the target project (defaults to cwd).
    """
    from agents.orchestrator import run_swarm

    root = project_root or str(Path.cwd())
    result = run_swarm(goal, project_root=root)
    lines = [f"success: {result.success}", f"output: {result.output}"]
    if result.artifacts:
        lines.append(f"artifacts: {', '.join(result.artifacts)}")
    duration = (result.metadata or {}).get("duration")
    if duration:
        lines.append(f"duration: {duration:.1f}s")
    return "\n".join(lines)


@mcp.tool()
def athena_claw(goal: str, project_root: str = "") -> str:
    """Run the fast ATHENA single-agent ReAct loop.

    Best for quick edits, file reads, shell commands, and straightforward tasks.
    Uses the currently configured LLM provider from config.yaml.

    Args:
        goal: Task description in plain English.
        project_root: Absolute path to the target project (defaults to cwd).
    """
    from core.react_loop import get_react_loop

    root = project_root or str(Path.cwd())
    loop = get_react_loop(project_root=root)
    out = loop.run(goal)
    lines = [
        f"final_answer: {out.get('final_answer', '')}",
        f"iterations: {out.get('iterations', 0)}",
    ]
    if out.get("artifacts"):
        lines.append(f"artifacts: {', '.join(out['artifacts'])}")
    return "\n".join(lines)


@mcp.tool()
def athena_status(project_root: str = "") -> str:
    """Return ATHENA memory stats and current LLM configuration.

    Args:
        project_root: Absolute path to the target project (defaults to cwd).
    """
    from hermes.memory import get_memory
    from core.llm import get_llm_manager

    root = project_root or str(Path.cwd())
    mem = get_memory(project_root=root)
    llm = get_llm_manager(root)

    task_count = mem.get_task_count() if hasattr(mem, "get_task_count") else "N/A"
    should_improve = mem.should_trigger_self_improve() if hasattr(mem, "should_trigger_self_improve") else "N/A"

    return (
        f"tasks_completed: {task_count}\n"
        f"self_improve_triggered: {should_improve}\n"
        f"llm_provider: {llm.get_provider_name()}\n"
        f"llm_model: {llm.get_default_model()}"
    )


@mcp.tool()
def athena_doctor(project_root: str = "") -> str:
    """Run the ATHENA system health check.

    Checks tools harness, memory, LLM config, and dashboard API availability.

    Args:
        project_root: Absolute path to the target project (defaults to cwd).
    """
    import socket
    from core.tools import get_tools
    from hermes.memory import get_memory
    from core.llm import get_llm_manager

    root = project_root or str(Path.cwd())
    results: list[str] = []

    try:
        health = get_tools(root).health_check()
        results.append(f"tools: {'OK' if health.get('success') else 'FAIL'} {health.get('metadata', {})}")
    except Exception as e:
        results.append(f"tools: FAIL ({e})")

    try:
        mem = get_memory(project_root=root)
        count = mem.get_task_count() if hasattr(mem, "get_task_count") else "N/A"
        results.append(f"memory: OK (tasks={count})")
    except Exception as e:
        results.append(f"memory: FAIL ({e})")

    try:
        llm = get_llm_manager(root)
        results.append(f"llm: OK (provider={llm.get_provider_name()}, model={llm.get_default_model()})")
    except Exception as e:
        results.append(f"llm: FAIL ({e})")

    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        up = s.connect_ex(("127.0.0.1", 8001)) == 0
        s.close()
        results.append(f"dashboard_8001: {'OK' if up else 'not running'}")
    except Exception:
        results.append("dashboard_8001: unknown")

    return "\n".join(results)


@mcp.tool()
def athena_daemon_scan(project_root: str = "") -> str:
    """Run one ATHENA autonomous maintenance scan cycle.

    Scans for TODOs, syntax errors, dirty git state, and failing tests,
    then attempts auto-fixes. Respects approval gates in config.yaml.

    Args:
        project_root: Absolute path to the target project (defaults to cwd).
    """
    from core.kairos_daemon import ATHENADaemon

    root = project_root or str(Path.cwd())
    ATHENADaemon(project_root=root).run_once()
    return "ATHENA scan complete. Check hermes/hermes.log for details."


def main() -> None:
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
