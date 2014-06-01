<header class="navbar navbar-inverse ">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Back</a>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li>
                    <?php echo $this->Html->link('Folders', array(
                        'controller' => 'porfolios',
                        'action' => 'index',
                        'admin' => false
                    )); ?>
                </li>
                <li>
                    <?php echo $this->Html->link('Tags', array(
                        'controller' => 'tags',
                        'action' => 'index',
                        'admin' => false
                    )); ?>
                </li>
                <li>
                    <?php echo $this->Html->link('Logout', array(
                        'controller' => 'users',
                        'action' => 'logout',
                        'admin' => false
                    ),array('data-bypass')); ?>
                </li>
            </ul>
        </div><!--/.navbar-collapse -->
    </div>
</header>