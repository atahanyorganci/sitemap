{
  perSystem = { ... }: {
    treefmt = {
      projectRootFile = "flake.nix";
      programs = {
        deadnix.enable = true;
        nixpkgs-fmt.enable = true;
        yamlfmt = {
          enable = true;
          excludes = [ "pnpm-lock.yaml" ];
        };
      };
    };
  };
}
