"""mcp_server.py
Thin shim — delegates to athena_mcp.server.

Run directly:   python mcp_server.py
Via uvx:        uvx athena-mcp
Via npm shim:   athena-mcp
"""
from athena_mcp.server import main

if __name__ == "__main__":
    main()
