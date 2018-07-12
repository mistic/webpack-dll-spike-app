# Todo Roadmap

* **Compiler Run Logic** 
  * Multiple webpack compiler execution 
  * Allow configuration by params and default in a 
    missing situation (config, model, model-defaults.json)
  * Dependency management between compilation parts ex:</br>
  
    * part_1 -> (depends) []
    * part_2 -> (depends) [part_1]
    * part_3 -> (depends) [part_1]
    * part_4 -> (depends) [part_1, part2]
    * part_5 -> (depends) [part_1]</br>
      
      A good strategy could be start from the ones who haves less
      dependencies and more references. A part with no dependencies
      should be always included, and it will be also useful look at 
      the include order in the parts compilation.
      
  * Try to group compilation parts in sub parallel executions inside
    the main sequential execution like for example:</br>
    
    * part 1
    * part 2
    * part 3, part 4, part 5
    
  * Map compilation parts by idNames
  
  * Generates compilation result file with build order
    
* **Loader Run Logic**
  * Insure we have the needed compiled DLLs otherwise 
    triggers the compilation. The logic could be:</br>
    
      1 - Look for compilation result file and: </br>
      
        a. Recompile if it misses or is invalid
        b. Proceed if it exists
        
      2 - Cross-check with package json and: </br>
        
        a. Recompile if exist differences
        b. Proceed if no differences were found
        
      3 - Cross-check dll folder with compilation result file
          and recompile if there are dlls missing.
      
  * Simple webpack compiler execution
  
* **Loader Configuration Logic**
  * Allow configuration by params and default in a 
    missing situation (config, model, model-defaults.json)
  * Discovery of generated DLLs -> cross-check with compilation 
    result file 
  * Add to index.html the compilation assets
    according the compilation result file
  * Should recompile on changes in development
  
* **Balance Dev/Prod WorkFlows**
  * Complete NPM tasks flow
  
* **Cache**
  *  Build a complete long term cache both for dev and prod in order to 
     trigger compilations only for the changing parts.
