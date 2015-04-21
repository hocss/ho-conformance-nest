
class Node {
    constructor( opts ) {
        if ( !opts ) {
            throw new Error( 'Must instantiate Tree:Node with options' )
        }

        this.name = opts.name
        this.numChildren = opts.numChildren
        this.parent = opts.parent

        this.child = null
    }

    addChild( node ) {
        this.child = node
    }

    removeChild() {
        this.child = null
    }
}


export default class Tree {
    constructor() {
        this.root = null
    }

    get pwd() {
        var tmp = this.root
        var where = [
            tmp.name
        ]
        while( tmp.child ) {
            tmp = tmp.child
            where.push( tmp.name )
        }
        return where.join( ' ' )
    }

    get current() {
        var tmp = this.root
        while( tmp.child ) {
            tmp = tmp.child
        }
        return tmp
    }

    addChild( opts ) {
        if ( !this.root ) {
            this.root = new Node({
                name: 'root',
                numChildren: opts.numChildren,
                parent: null
            })
            return
        }

        this.current.addChild( new Node({
            name: opts.name,
            numChildren: opts.numChildren,
            parent: this.current
        }))
    }

    removeChild() {
        if ( this.current.name === 'root' ) {
            this.root = null
            return
        }
        this.current.parent.removeChild()
    }
}
