
import chalk from 'chalk'
import core from 'core-js/library'

import Base from 'ho-conformance-base'

import Tree from './tree'

/**
 * Nest
 * Monitors selector nesting levels
 * @class
 */
export default class Nest extends Base {
    /**
     * @constructs
     * @param opts <Object>
     */
    constructor( opts ) {
        super()

        this.taskName = 'Nest'
        this.runner = null

        // Manages the selector tree
        this.tree = new Tree()

        this._bindHandlers()
    }

    /**
     * install
     * @param opts <Object>
     */
    install( opts ) {
        super.install( opts )
    }

    /**
     * destroy
     */
    destroy() {
        super.destroy()
    }


    _parseSelectors( selectors ) {
        let path = []

        // If no selectors are passed from the ruleset then assume root node
        if ( !selectors ) {
            return 'root'
        }

        selectors.forEach( selector => {
            selector.elements.forEach( elements => {
                path.push( elements.value )
            })
        })
        return path.join( ' ' )
    }


    /*-----------------------------------------------------------*\
     *
     *  Listeners
     *
    \*-----------------------------------------------------------*/

    onRuleset( rule ) {
        var children = rule.raw.rulesets()

        if ( children.length > 0 ) {
            this.tree.addChild({
                name: this._parseSelectors( rule.raw.selectors ),
                numChildren: children.length
            })
        }

        this.log( chalk.cyan( this.tree.pwd ) )
    }

}
