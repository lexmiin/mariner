{
  description = "A Nix-flake-based Node.js and pnpm development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.fnox.url = "github:lexmiin/fnox-nix";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    fnox,
  }: (
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [fnox.overlays.default];
        };
      in {
        formatter = pkgs.alejandra;

        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_22
            pkgs.pnpm_11
            pkgs.fnox
          ];
        };
      }
    )
  );
}
