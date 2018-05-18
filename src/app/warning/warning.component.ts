import { Component } from "@angular/core";

@Component({
    selector: 'app-warning',
    templateUrl: './warning.component.html'
})
export class WarningComponent{
    allowServerButton = false;

    getServerEnvironment(){
        return 'Development';
    }

        
    }




