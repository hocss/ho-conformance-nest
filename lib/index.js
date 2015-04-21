
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

        if ( opts && opts.suppressOutput ) {
            this.log = function() { /* noop */ }
        }

        this.taskName = 'Nest'
        this.runner = null

        this._reset()

        this._bindHandlers()
    }

    _reset() {
        this._level = 0
        this._upLevel = false
        this._downLevel = false

        // Manages the selector tree
        this.tree = new Tree()
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

        if ( this._upLevel ) {
            this._level++
            this._upLevel = false
        }

        if ( children.length > 0 ) {
            this.tree.addChild({
                name: this._parseSelectors( rule.raw.selectors ),
                numChildren: children.length
            })
            this.log( chalk.cyan( this.tree.pwd ), chalk.magenta( this._level ) )
            this._upLevel = true
            return
        }

        var current

        try {
            current = this.tree.current
        } catch( err ) {
            // Under some circumstances root will contain rules but no children
            // i.e. module files containing only variables and/or comments
            return;
        }

        current.numChildren--

        if ( this._downLevel ) {
            this._level--
            this.tree.removeChild()
            this._downLevel = false
        }

        try {
            this.log( chalk.cyan( this.tree.pwd, this._parseSelectors( rule.raw.selectors ) ), chalk.magenta( this._level ) )
        } catch( err ) {
            console.error( err )
        }

        current = this.tree.current

        if ( current.numChildren <= 0 ) {
            this._downLevel = true
        }
    }

    onRoot( rule ) {
        this._reset()
    }

}
