import { ErrorMapper } from "utils/ErrorMapper";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
/**
  * Running rollup -c will compile your code and do a "dry run", preparing the code for upload but not actually pushing it.
  * Running rollup -c --environment DEST:main will compile your code, and then upload it to a screeps server using the main config from screeps.json.
  * You can use -cw instead of -c to automatically re-run when your source code changes.
  * For example, rollup -cw --environment DEST:main will automatically upload your code to the main configuration every time your code is changed.
  * Finally, there are also NPM scripts that serve as aliases for these commands in package.json for IDE integration.
  * Running npm run push-main is equivalent to rollup -c --environment DEST:main, and npm run watch-sim is equivalent to rollup -cw --dest sim.
 **/

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  deleteDead(); // Automatically delete memory of missing creeps

});


/**
 * Get rid of creeps that no longer exist
 */
function deleteDead()
{
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}
