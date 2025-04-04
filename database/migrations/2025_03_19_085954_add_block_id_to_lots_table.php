<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // remove the block_number column from the lots table
        if (Schema::hasColumn('lots', 'block_number')) {
            Schema::table('lots', function (Blueprint $table) {
                $table->dropColumn('block_number');
            });
        }
    }

    public function down()
    {
        // add the block_number column back if rolling back migration
        if (!Schema::hasColumn('lots', 'block_number')) {
            Schema::table('lots', function (Blueprint $table) {
                $table->string('block_number')->after('block_id');
            });
        }
    }
};

