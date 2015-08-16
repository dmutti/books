class BinaryTree {
    private int key;
    private Object value;
    private BinaryTree right;
    private BinaryTree left;

    public BinaryTree(int _key,Object _value) {
        key   = _key;
        value = _value;
        right = left = null;
    }

    // Lookup a node with a specific key
    public Object lookup(int _key) {
        BinaryTree descend;
        if (_key == key)
            return value;
        if (_key < key)
            descend = left;
        else
            descend = right;
        if (descend == null)
            return null;
        return descend.lookup(_key);
    }

    // Insert a node with a certain key and value
    public void insert(int _key, Object _value) {
        if (_key <= key)
            if (left == null)
                left = new BinaryTree(_key,_value);
            else
                left.insert(_key,_value);
        else
            if (right == null)
                right = new BinaryTree(_key,_value);
            else
                right.insert(_key,_value);
    }

    // Delete a node with a certain key
    public boolean delete (int key) {
        // ...
        return true;
    }
}
