<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class MoveModelUrlToBlocks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // add model_url column to the blocks table
        Schema::table('blocks', function (Blueprint $table) {
            $table->string('model_url')->nullable();  
        });

        // transfer model_url values from lots to blocks 
        DB::table('blocks')->get()->each(function ($block) {
            // get model_url from the first related lot 
            $lotModelUrl = DB::table('lots')
                ->where('block_id', $block->id)
                ->value('model_url');
            
            // if a model_url exists for lot, update block with it
            if ($lotModelUrl) {
                DB::table('blocks')
                    ->where('id', $block->id)
                    ->update(['model_url' => $lotModelUrl]);
            }
        });

        // remove the model_url column from the lots table 
        Schema::table('lots', function (Blueprint $table) {
            $table->dropColumn('model_url');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // remove the model_url column from the blocks table
        Schema::table('blocks', function (Blueprint $table) {
            $table->dropColumn('model_url');
        });

    }
}
